import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { z } from 'zod';
import { logger, prisma } from '../../backend';
import { PermissionLevel } from '../../helpers/permissions';
import { sendResponse } from '../../helpers/response';
import { MonitorType } from '../../models/MonitoringMonitor';
import {
  deletePrismaMonitor,
  getMonitor,
  getMonitors,
  pushPrismaMonitor,
  updatePrismaMonitor,
} from '../../monitoring/monitoring';
import { Route } from '../../route';

const monitorSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.nativeEnum(MonitorType),
  url: z.string().min(1).max(2048),
  interval: z.number().min(1),
  parameters_json: z.string().optional(),
});

export default [
  {
    method: 'GET',
    path: '/monitoring/monitors',
    permissionLevel: PermissionLevel.USER,
    handler: async (req, res) => {
      const { id } = req.query;

      if (id) {
        const monitor = getMonitor(Number(id));

        if (!monitor) {
          return sendResponse(res, 404, 'Monitor not found');
        }

        return sendResponse(res, 200, undefined, await monitor.toJSON());
      }

      return sendResponse(res, 200, undefined, await Promise.all(getMonitors().map((mon) => mon.toJSON())));
    },
  } as Route,
  {
    method: 'POST',
    path: '/monitoring/monitors',
    permissionLevel: PermissionLevel.USER,
    handler: async (req, res) => {
      try {
        const parsedBody = monitorSchema.safeParse(req.body);

        if (!parsedBody.success) {
          logger.debug(parsedBody.error.issues[0].message);
          return sendResponse(
            res,
            400,
            `Bad Request (${parsedBody.error.issues[0].path}: ${parsedBody.error.issues[0].message})`,
          );
        }

        const monitor = await prisma.monitor.create({
          data: {
            ...parsedBody.data,
            ownerId: res.locals.user && res.locals.user.id,
          },
        });

        if (monitor) {
          pushPrismaMonitor(monitor);
          return sendResponse(res, 201, undefined, monitor);
        } else {
          return sendResponse(res, 500, 'Internal Server Error');
        }
      } catch (error: any) {
        if (error.code === 'P2002') {
          return sendResponse(res, 409, 'Monitor already exists');
        } else if (error instanceof PrismaClientValidationError) {
          return sendResponse(res, 400, 'Bad Request');
        } else {
          logger.error('[API/monitors] Error creating monitor:');
          logger.error(error);
          return sendResponse(res, 500, 'Internal Server Error');
        }
      }
    },
  } as Route,
  {
    method: 'PATCH',
    path: '/monitoring/monitors',
    permissionLevel: PermissionLevel.USER,
    handler: async (req, res) => {
      const { id } = req.query;

      try {
        const parsedBody = monitorSchema.partial().safeParse(req.body);

        if (!parsedBody.success) {
          logger.debug(parsedBody.error.issues[0].message);
          return sendResponse(
            res,
            400,
            `Bad Request (${parsedBody.error.issues[0].path}: ${parsedBody.error.issues[0].message})`,
          );
        }

        const monitor = await prisma.monitor.update({
          where: {
            id: Number(id),
          },
          data: parsedBody.data,
        });

        updatePrismaMonitor(monitor);
        return sendResponse(res, 200, undefined, monitor);
      } catch (error: any) {
        if (error.code === 'P2025') {
          return sendResponse(res, 404, 'Monitor not found');
        } else if (error instanceof PrismaClientValidationError) {
          return sendResponse(res, 400, 'Bad Request');
        } else {
          logger.error('[API/monitors] Error updating monitor:');
          logger.error(error);
          return sendResponse(res, 500, 'Internal Server Error');
        }
      }
    },
  } as Route,
  {
    method: 'DELETE',
    path: '/monitoring/monitors',
    permissionLevel: PermissionLevel.USER,
    handler: async (req, res) => {
      const { id } = req.query;

      try {
        await prisma.monitorHistory.deleteMany({
          where: {
            monitorId: Number(id),
          },
        });

        const mon = await prisma.monitor.delete({
          where: {
            id: Number(id),
          },
        });

        deletePrismaMonitor(mon);
        return sendResponse(res, 204);
      } catch (error: any) {
        if (error.code === 'P2025') {
          return sendResponse(res, 404, 'Monitor not found');
        } else if (error instanceof PrismaClientValidationError) {
          return sendResponse(res, 400, 'Bad Request');
        } else {
          logger.error('[API/monitors] Error deleting monitor:');
          logger.error(error);
          return sendResponse(res, 500, 'Internal Server Error');
        }
      }
    },
  } as Route,
];

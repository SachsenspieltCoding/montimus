import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { logger, prisma } from "../backend";
import { PermissionLevel } from "../helpers/permissions";
import { sendResponse } from "../helpers/response";
import { MonitorType } from "../models/MonitoringMonitor";
import {
  deletePrismaMonitor,
  getMonitor,
  getMonitors,
  pushPrismaMonitor,
  updatePrismaMonitor,
} from "../monitoring/monitoring";
import { Route } from "../route";

export default [
  {
    method: "GET",
    path: "/monitors",
    permissionLevel: PermissionLevel.USER,
    handler: async (_req, res) => {
      return sendResponse(
        res,
        200,
        undefined,
        await Promise.all(getMonitors().map((mon) => mon.toJSON())),
      );
    },
  } as Route,
  {
    method: "POST",
    path: "/monitors",
    permissionLevel: PermissionLevel.USER,
    handler: async (req, res) => {
      try {
        if (!Object.values(MonitorType).includes(req.body.type)) {
          return sendResponse(res, 400, "Bad Request (Invalid type)");
        }

        if (req.body.interval < 5) {
          return sendResponse(res, 400, "Bad Request (Invalid interval)");
        }

        const monitor = await prisma.monitor.create({
          data: { ...req.body, ownerId: res.locals.user && res.locals.user.id },
        });

        if (monitor) {
          pushPrismaMonitor(monitor);
          return sendResponse(res, 201, undefined, monitor);
        } else {
          return sendResponse(res, 500, "Internal Server Error");
        }
      } catch (error: any) {
        if (error.code === "P2002") {
          return sendResponse(res, 409, "Monitor already exists");
        } else if (error instanceof PrismaClientValidationError) {
          return sendResponse(res, 400, "Bad Request");
        } else {
          logger.error("[API/monitors] Error creating monitor:");
          logger.error(error);
          return sendResponse(res, 500, "Internal Server Error");
        }
      }
    },
  } as Route,
  {
    method: "GET",
    path: "/monitors/:id",
    permissionLevel: PermissionLevel.USER,
    handler: async (req, res) => {
      const { id } = req.params;

      const monitor = getMonitor(Number(id));

      if (!monitor) {
        return sendResponse(res, 404, "Monitor not found");
      }

      return sendResponse(res, 200, undefined, await monitor.toJSON());
    },
  } as Route,
  {
    method: "PATCH",
    path: "/monitors/:id",
    permissionLevel: PermissionLevel.USER,
    handler: async (req, res) => {
      const { id } = req.params;

      try {
        const monitor = await prisma.monitor.update({
          where: {
            id: Number(id),
          },
          data: req.body,
        });

        updatePrismaMonitor(monitor);
        return sendResponse(res, 200, undefined, monitor);
      } catch (error: any) {
        if (error.code === "P2025") {
          return sendResponse(res, 404, "Monitor not found");
        } else if (error instanceof PrismaClientValidationError) {
          return sendResponse(res, 400, "Bad Request");
        } else {
          logger.error("[API/monitors] Error updating monitor:");
          logger.error(error);
          return sendResponse(res, 500, "Internal Server Error");
        }
      }
    },
  } as Route,
  {
    method: "DELETE",
    path: "/monitors/:id",
    permissionLevel: PermissionLevel.USER,
    handler: async (req, res) => {
      const { id } = req.params;

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
        if (error.code === "P2025") {
          return sendResponse(res, 404, "Monitor not found");
        } else if (error instanceof PrismaClientValidationError) {
          return sendResponse(res, 400, "Bad Request");
        } else {
          logger.error("[API/monitors] Error deleting monitor:");
          logger.error(error);
          return sendResponse(res, 500, "Internal Server Error");
        }
      }
    },
  } as Route,
];

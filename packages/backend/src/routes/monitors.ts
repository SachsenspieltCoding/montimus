import { PrismaClientValidationError } from '@prisma/client/runtime/library'
import { logger, prisma } from '../backend'
import { sendResponse } from '../helpers/response'
import { Route } from '../route'
import { PermissionLevel } from '../helpers/permissions'

export default [
  {
    method: 'GET',
    path: '/monitors',
    permissionLevel: PermissionLevel.USER,
    handler: async (_req, res) => {
      const monitors = await prisma.monitor.findMany()
      const mons = await Promise.all(
        monitors.map(async (mon) => ({
          ...mon,
          lastHistory: await getLatestHistory(mon.id),
        }))
      )
      return sendResponse(res, 200, undefined, mons)
    },
  } as Route,
  {
    method: 'POST',
    path: '/monitors',
    permissionLevel: PermissionLevel.USER,
    handler: async (req, res) => {
      try {
        const monitor = await prisma.monitor.create({
          data: req.body,
        })

        sendResponse(res, 201, undefined, monitor)
      } catch (error: any) {
        if (error.code === 'P2002') {
          return sendResponse(res, 409, 'Monitor already exists')
        } else if (error instanceof PrismaClientValidationError) {
          return sendResponse(res, 400, 'Bad Request')
        } else {
          logger.error('[API/monitors] Error creating monitor:')
          logger.error(error)
          return sendResponse(res, 500, 'Internal Server Error')
        }
      }
    },
  } as Route,
  {
    method: 'GET',
    path: '/monitors/:id',
    permissionLevel: PermissionLevel.USER,
    handler: async (req, res) => {
      const { id } = req.params

      const monitor = await prisma.monitor.findUnique({
        where: {
          id: Number(id),
        },
      })

      if (monitor === null) {
        return sendResponse(res, 404, 'Monitor not found')
      }

      sendResponse(res, 200, undefined, {
        ...monitor,
        lastHistory: await getLatestHistory(monitor.id),
      })
    },
  } as Route,
  {
    method: 'PATCH',
    path: '/monitors/:id',
    permissionLevel: PermissionLevel.USER,
    handler: async (req, res) => {
      const { id } = req.params

      try {
        const monitor = await prisma.monitor.update({
          where: {
            id: Number(id),
          },
          data: req.body,
        })

        sendResponse(res, 200, undefined, monitor)
      } catch (error: any) {
        if (error.code === 'P2025') {
          return sendResponse(res, 404, 'Monitor not found')
        } else if (error instanceof PrismaClientValidationError) {
          return sendResponse(res, 400, 'Bad Request')
        } else {
          logger.error('[API/monitors] Error updating monitor:')
          logger.error(error)
          return sendResponse(res, 500, 'Internal Server Error')
        }
      }
    },
  } as Route,
  {
    method: 'DELETE',
    path: '/monitors/:id',
    permissionLevel: PermissionLevel.USER,
    handler: async (req, res) => {
      const { id } = req.params

      try {
        await prisma.monitor.delete({
          where: {
            id: Number(id),
          },
        })

        return sendResponse(res, 204)
      } catch (error: any) {
        if (error.code === 'P2025') {
          return sendResponse(res, 404, 'Monitor not found')
        } else if (error instanceof PrismaClientValidationError) {
          return sendResponse(res, 400, 'Bad Request')
        }
      }
    },
  } as Route,
]

async function getLatestHistory(monitorId: number) {
  return await prisma.monitorHistory.findFirst({
    where: {
      monitorId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

import { PrismaClientValidationError } from '@prisma/client/runtime/library'
import { logger, prisma } from '../backend'
import { sendResponse } from '../helpers/response'
import { Route } from '../route'

export default [
  {
    method: 'GET',
    path: '/monitors',
    handler: async (_req, res) => {
      const monitors = await prisma.monitor.findMany()
      return sendResponse(res, 200, undefined, monitors)
    },
  } as Route,
  {
    method: 'POST',
    path: '/monitors',
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
          logger.error(error)
          return sendResponse(res, 500, 'Internal Server Error')
        }
      }
    },
  } as Route,
  {
    method: 'GET',
    path: '/monitors/:id',
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

      sendResponse(res, 200, undefined, monitor)
    },
  } as Route,
  {
    method: 'PATCH',
    path: '/monitors/:id',
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
          logger.error(error)
          return sendResponse(res, 500, 'Internal Server Error')
        }
      }
    },
  } as Route,
  {
    method: 'DELETE',
    path: '/monitors/:id',
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

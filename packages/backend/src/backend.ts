import express from 'express'
import log4js from 'log4js'
import routeIndex from './routeIndex'
import { sendResponse } from './helpers/response'
import { PrismaClient } from '@prisma/client'

const app = express()
const port = process.env.BACKEND_PORT || 3000
const packageJson = require('../package.json')

// Configure logging
const logger = log4js.getLogger(packageJson.name)
logger.level = 'debug'

logger.info('Starting backend on port %d', port)

// Configure Prisma
const prisma = new PrismaClient()

// Middlewares
app.use(express.json())

app.get('/', (_req, res) => {
  sendResponse(res, 200, packageJson.version)
})

// Register all routes in the index
routeIndex(app)

// Fallback route
app.use((_req, res) => {
  sendResponse(res, 404, 'Not found')
})

app.listen(3000, async () => {
  try {
    // Test if everything is working
    await prisma.$connect()
    logger.info('Connected to database!')
  } catch (error: any) {
    logger.fatal(error.message)
    logger.error('Error connecting to database, shutting down.', error.message)
    process.exit(1)
  }

  logger.info('Backend listening on http://localhost:%d', port)
})

export { logger, prisma }

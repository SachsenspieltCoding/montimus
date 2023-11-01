// Configure logging first, so the prefix is set correctly
import { createLogger } from './logger'
import initLogger from './logger'

const packageJson = require('../package.json')
const port = process.env.BACKEND_PORT || 3000

initLogger(packageJson.name)
const logger = createLogger('main', 'debug')

logger.info('Starting backend on port %d', port)

// Import everything else after logging is configured
import express from 'express'
import routeIndex from './routeIndex'
import { sendResponse } from './helpers/response'
import { PrismaClient } from '@prisma/client'
import { initMonitoring } from './monitoring/monitoring'

const app = express()

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

// Init monitoring
initMonitoring()

export { prisma, packageJson }

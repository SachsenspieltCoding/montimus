import express from 'express'
import log4js from 'log4js'
import routeIndex from './routeIndex'
import { sendResponse } from './helpers/response'

const app = express()
const port = process.env.BACKEND_PORT || 3000
const packageJson = require('../package.json')

const logger = log4js.getLogger(packageJson.name)
logger.level = 'debug'

logger.info('Starting backend on port %d', port)

app.get('/', (_req, res) => {
  sendResponse(res, 200, packageJson.version)
})

// Register all routes in the index
routeIndex(app)

// Fallback route
app.use((_req, res) => {
  sendResponse(res, 404, 'Not found')
})

app.listen(3000, () => {
  logger.info('Backend listening on http://localhost:%d', port)
})

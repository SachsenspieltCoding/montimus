import express from 'express'
import log4js from 'log4js'

const app = express()
const port = process.env.PORT || 3000

const logger = log4js.getLogger(require('../package.json').name)
logger.level = 'debug'

logger.info('Starting backend on port %d', port)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  logger.info('Backend listening on http://localhost:%d', port)
})

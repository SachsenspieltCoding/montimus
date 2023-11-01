import { getLogger } from 'log4js'

let loggerPrefix = ''

export default (name: string) => {
  loggerPrefix = name
}

export function createLogger(name: string, level: string = 'info') {
  const logger = getLogger(`${loggerPrefix}:${name}`)
  logger.level = level
  return logger
}

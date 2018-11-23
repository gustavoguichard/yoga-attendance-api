// A hook that logs service method before, after and error
const winston = require('winston')

module.exports = () => hook => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  })
  let message = `${hook.type}: ${hook.path} - Method: ${hook.method}`

  if (hook.type === 'error') {
    message += `: ${hook.error.message}`
  }

  message = process.env.NODE_ENV === 'test' ? '' : message

  message && logger.info(message)
  logger.debug('hook.data', hook.data)
  logger.debug('hook.params', hook.params)

  if (hook.result) {
    logger.debug('hook.result', hook.result)
  }

  if (hook.error) {
    logger.error(hook.error)
  }
}

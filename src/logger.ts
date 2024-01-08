import log4js from "log4js"

const logger = log4js.getLogger()

logger.level = process.env.LOG_LEVEL || "warn"

export function trace(message: any, ...args: any[]) { logger.trace(message, ...args) }
export function debug(message: any, ...args: any[]) { logger.debug(message, ...args) }
export function info (message: any, ...args: any[]) { logger.info (message, ...args) }
export function warn (message: any, ...args: any[]) { logger.warn (message, ...args) }
export function error(message: any, ...args: any[]) { logger.error(message, ...args) }
export function fatal(message: any, ...args: any[]) { logger.fatal(message, ...args) }
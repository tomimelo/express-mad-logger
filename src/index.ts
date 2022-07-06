import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { MadLogger } from 'mad-logger'

export const expressMadLogger = {
  getMiddleware: (parentLogger: MadLogger) => {
    const logger = parentLogger.child('request-logger')
    return function (req: Request, res: Response, next: NextFunction) {
      const reqId = uuidv4()
      req.headers.reqId = reqId
      const startTime = new Date()
  
      const resEndFn = res.end.bind(res)
      res.end = function (cb?: (() => void) | undefined) {
        const timeTaken = `+${new Date().getTime() - startTime.getTime()}ms`
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${timeTaken}`
        logger.info(message, { reqId })
        return resEndFn(cb)
      } 
      next()
    }
  }
}
import { IMiddleware } from '@/application/middlewares'
import { RequestHandler } from 'express'

type Adapter = (middleware: IMiddleware) => RequestHandler

export const adaptExpressMiddleware: Adapter =
  middleware => async (req, res, next) => {
    const { statusCode, data } = await middleware.handle({ ...req.headers })
    if (statusCode === 200) {
      const entries = Object.fromEntries(
        Object.entries(data).filter(entry => entry[1])
      )
      req.locals = { ...req.locals, ...entries }
      next()
    }
    res.status(statusCode).json(data)
  }

import { Controller } from '@/application/controller'
import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler
export const adaptRouteExpress: Adapter = controller => async (req, res) => {
  const { statusCode, data } = await controller.handle({ ...req.body })
  if (statusCode === 200) {
    res.status(statusCode).json(data)
  } else {
    res.status(statusCode).json({ error: data.message })
  }
}

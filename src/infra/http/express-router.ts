import { Controller } from '@/application/controller'
import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler
export const adapt: Adapter = controller => async (req, res) => {
  const httpResponse = await controller.handle({ ...req.body })
  if (httpResponse.statusCode === 200) {
    res.status(httpResponse.statusCode).json(httpResponse.data)
  } else {
    res
      .status(httpResponse.statusCode)
      .json({ error: httpResponse.data.message })
  }
}

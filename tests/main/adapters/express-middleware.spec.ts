import { HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { MockProxy, mock } from 'jest-mock-extended'

type Adapter = (middleware: IMiddleware) => RequestHandler

export interface IMiddleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}
export const adaptExpressMiddleware: Adapter =
  middleware => async (req, _res, _next) => {
    await middleware.handle({ ...req.headers })
  }

describe('ExpressMiddleware', () => {
  let middleware: MockProxy<IMiddleware>
  let sut: RequestHandler
  let req: Request
  let res: Response
  let next: NextFunction
  beforeAll(() => {
    middleware = mock()
    req = getMockReq({ headers: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
  })

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware)
  })

  it('Should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('Should call handle with empty request', async () => {
    req = getMockReq()

    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})

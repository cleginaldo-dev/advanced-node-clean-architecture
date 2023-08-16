import { IMiddleware } from '@/application/middlewares'
import { adaptExpressMiddleware } from '@/main/adapters'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { MockProxy, mock } from 'jest-mock-extended'

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
    middleware.handle.mockResolvedValue({
      statusCode: 200,
      data: {
        prop: 'any_value',
        emptyProp: '',
        nullProp: null,
        undefinedProp: undefined
      }
    })
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

  it('Should respond with error and statusCode', async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error')
    })

    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('Should add data to req.locals', async () => {
    await sut(req, res, next)

    expect(req.locals).toEqual({ prop: 'any_value' })
    expect(next).toHaveBeenCalledTimes(1)
  })
})

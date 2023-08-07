import { ForbiddenError } from '@/application/errors'
import { HttpResponse, forbidden } from '@/application/helpers'

type HttpRequest = { authorization: string }

export class AuthenticationMiddleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Error>> {
    return forbidden()
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  beforeAll(() => {
    sut = new AuthenticationMiddleware()
  })

  beforeEach(() => {})

  it('Should return 403 if authorization is empty', async () => {
    const httpResponse = await sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('Should return 403 if authorization is null', async () => {
    const httpResponse = await sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('Should return 403 if authorization is undefined', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
})

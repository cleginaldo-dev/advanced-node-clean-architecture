import { FacebookLoginController } from '@/application/controller/facebook-login-controller'
import { UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validation'
import { AuthenticationError } from '@/domain/entities/errors'

describe('FacebookLoginController', () => {
  let facebookAuth: jest.Mock
  let sut: FacebookLoginController
  let token: string
  beforeAll(() => {
    token = 'any_token'
    facebookAuth = jest.fn()
    facebookAuth.mockResolvedValue({ accessToken: 'any_token' })
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  it('Should build Validators correctly', async () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token')
    ])
  })

  it('Should call FacebookAuthentication with corrects params', async () => {
    await sut.handle({ token })

    expect(facebookAuth).toHaveBeenCalledWith({ token })
    expect(facebookAuth).toHaveBeenCalledTimes(1)
  })
  it('Should return 401 if authentication fails', async () => {
    facebookAuth.mockRejectedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })
  it('Should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: token
      }
    })
  })
})

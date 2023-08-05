import { mock, MockProxy } from 'jest-mock-extended'

interface ITokenValidator {
  validateToken: (params: ITokenValidator.Params) => Promise<void>
}

namespace ITokenValidator {
  export type Params = { token: string }
}

type Input = { token: string }

type Authorize = (params: Input) => Promise<void>
type Setup = (crypto: ITokenValidator) => Authorize

const setupAuthorize: Setup = crypto => async params => {
  await crypto.validateToken(params)
}

describe('Authorize', () => {
  let crypto: MockProxy<ITokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
    // crypto.validateToken.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  it('Should call TokenValidator with correct params', async () => {
    await sut({ token })
    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })
})

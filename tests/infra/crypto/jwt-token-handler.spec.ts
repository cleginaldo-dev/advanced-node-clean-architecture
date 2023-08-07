import { JwtTokenHandler } from '@/infra/crypto/jwt-token-handler'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler
  let secret: string
  let fakeJwt: jest.Mocked<typeof jwt>
  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('validateToken', () => {})

  describe('generateToken', () => {
    let key: string
    let token: string
    let expirationInMs: number
    let expiresIn: number
    beforeAll(() => {
      key = 'any_key'
      token = 'any_token'
      expirationInMs = 1000
      expiresIn = 1
      fakeJwt.sign.mockImplementation(() => token)
    })
    it('Should be able call sign with correct values', async () => {
      await sut.generateToken({ key, expirationInMs })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn })
    })
    it('Should be able a token on success', async () => {
      const generatedToken = await sut.generateToken({ key, expirationInMs })

      expect(generatedToken).toBe(token)
    })

    it('Should rethrow if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => {
        throw new Error('token_error')
      })
      const promise = sut.generateToken({ key, expirationInMs })

      expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })
})

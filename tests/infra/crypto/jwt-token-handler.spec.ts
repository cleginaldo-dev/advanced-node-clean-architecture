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
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
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

  describe('validateToken', () => {
    let token: string
    let key: string

    beforeAll(() => {
      token = 'any_token'
      key = 'any_key'
      fakeJwt.verify.mockImplementation(() => ({ key }))
    })
    it('Should be able call sign with correct values', async () => {
      await sut.validateToken({ token })

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret)
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
    })
    it('Should return the key used to sign', async () => {
      const generatedKey = await sut.validateToken({ token })

      expect(generatedKey).toBe(key)
    })

    it('Should rethrow if verify throws', async () => {
      fakeJwt.verify.mockImplementationOnce(() => {
        throw new Error('key_error')
      })
      const promise = sut.validateToken({ token })

      expect(promise).rejects.toThrow(new Error('key_error'))
    })

    it('Should throw if verify return null', async () => {
      fakeJwt.verify.mockImplementationOnce(() => null)
      const promise = sut.validateToken({ token })

      expect(promise).rejects.toThrow()
    })

    it('Should throw if verify return undefined', async () => {
      fakeJwt.verify.mockImplementationOnce(() => undefined)
      const promise = sut.validateToken({ token })

      expect(promise).rejects.toThrow()
    })
  })
})

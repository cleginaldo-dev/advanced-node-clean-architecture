import { AccessToken } from '@/domain/entities'

describe('AccessToken', () => {
  it('Should create with a value', async () => {
    const sut = new AccessToken('any_value')

    expect(sut).toEqual({ value: 'any_value' })
  })

  it('Should expire in 1800000 ms', async () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})

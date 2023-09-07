import { UniqueId } from '@/infra/gateways'

describe('UniqueId', () => {
  let date: Date
  let sut: UniqueId
  beforeAll(() => {
    date = new Date(2023, 9, 3, 10, 10, 10)
  })

  beforeEach(() => {
    sut = new UniqueId(date)
  })

  it('Should call UniqueId with correct input', () => {
    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20231003101010')
  })

  it('Should call UniqueId with correct input', () => {
    sut = new UniqueId(new Date(2024, 6, 4, 18, 1, 0))
    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20240704180100')
  })
})

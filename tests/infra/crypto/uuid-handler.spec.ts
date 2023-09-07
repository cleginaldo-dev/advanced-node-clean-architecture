import { IUuidGenerator } from '@/domain/contracts/gateways'
import { v4 } from 'uuid'

export class UuidHandler implements IUuidGenerator {
  uuid({ key }: IUuidGenerator.Input): IUuidGenerator.Output {
    return `${key}_${v4()}`
  }
}

jest.mock('uuid')
describe('UuidHandler', () => {
  let sut: UuidHandler
  beforeAll(() => {
    jest.mocked(v4).mockReturnValue('any_uuid')
  })

  beforeEach(() => {
    sut = new UuidHandler()
  })

  it('Should call uuid.v4', () => {
    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  it('Should return correct uuid', () => {
    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_any_uuid')
  })
})

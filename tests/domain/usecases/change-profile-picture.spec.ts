import { IUploadFile, IUuidGenerator } from '@/domain/contracts/gateways'
import {
  ChangeProfilePicture,
  setupChangeProfilePicture
} from '@/domain/usecases'
import { MockProxy, mock } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let file: Buffer
  let uuid: string
  let crypto: MockProxy<IUuidGenerator>
  let fileStorage: MockProxy<IUploadFile>
  let sut: ChangeProfilePicture
  beforeAll(() => {
    file = Buffer.from('any_buffer')
    uuid = 'any_unique_id'
    fileStorage = mock()
    crypto = mock()
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto)
  })

  it('Should call IUploadFile with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('Should not call IUploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })
})

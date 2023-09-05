import { IUploadFile, IUuidGenerator } from '@/domain/contracts/gateways'
import { ISaveUserPicture } from '@/domain/contracts/repositories'
import {
  ChangeProfilePicture,
  setupChangeProfilePicture
} from '@/domain/usecases'
import { MockProxy, mock } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let file: Buffer
  let uuid: string
  let crypto: MockProxy<IUuidGenerator>
  let userProfileRepo: MockProxy<ISaveUserPicture>
  let fileStorage: MockProxy<IUploadFile>
  let sut: ChangeProfilePicture
  beforeAll(() => {
    file = Buffer.from('any_buffer')
    uuid = 'any_unique_id'
    fileStorage = mock()
    crypto = mock()
    userProfileRepo = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
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

  it('Should not call SaveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: 'any_url'
    })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })
})

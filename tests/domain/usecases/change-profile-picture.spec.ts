import {
  IDeleteFile,
  IUploadFile,
  IUuidGenerator
} from '@/domain/contracts/gateways'
import {
  ILoadUserProfile,
  ISaveUserPicture
} from '@/domain/contracts/repositories'
import { UserProfile } from '@/domain/entities'
import {
  ChangeProfilePicture,
  setupChangeProfilePicture
} from '@/domain/usecases'
import { MockProxy, mock } from 'jest-mock-extended'

jest.mock('@/domain/entities/user-profile')
describe('ChangeProfilePicture', () => {
  const saveError = new Error('save_error')
  let file: Buffer
  let uuid: string
  let crypto: MockProxy<IUuidGenerator>
  let userProfileRepo: MockProxy<ISaveUserPicture & ILoadUserProfile>
  let fileStorage: MockProxy<IUploadFile & IDeleteFile>
  let sut: ChangeProfilePicture
  beforeAll(() => {
    file = Buffer.from('any_buffer')
    uuid = 'any_unique_id'
    fileStorage = mock()
    crypto = mock()
    userProfileRepo = mock()
    userProfileRepo.load.mockResolvedValue({
      name: 'Cleginaldo Bandeira de Lima'
    })
    fileStorage.upload.mockResolvedValue('any_url')
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
  })

  it('Should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('Should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  it('Should not call SaveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(
      ...jest.mocked(UserProfile).mock.instances
    )
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('Should call LoadUserProfile with correct input', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.load).toHaveBeenCalledWith({
      id: 'any_id'
    })
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should not call LoadUserProfile when file is provided', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.load).not.toHaveBeenCalled()
  })

  it('Should ChangeProfilePicture return correct data on success', async () => {
    jest.mocked(UserProfile).mockImplementationOnce(() => ({
      setPicture: jest.fn(),
      id: 'any_id',
      initials: 'any_initials',
      pictureUrl: 'any_picture_url'
    }))

    const result = await sut({ id: 'any_id', file })

    expect(result).toMatchObject({
      initials: 'any_initials',
      pictureUrl: 'any_picture_url'
    })
  })

  it('Should call DeleteFile when file is provided and SaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(saveError)
    expect.assertions(2)
    const promise = sut({ id: 'any_id', file })

    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith({ key: uuid })
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    })
  })

  it('Should not call DeleteFile when file does not exists and SaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(saveError)
    expect.assertions(1)

    const promise = sut({ id: 'any_id', file: undefined })

    promise.catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled()
    })
  })
})

import { IUploadFile, IUuidGenerator } from '@/domain/contracts/gateways'

import { ILoadUserProfile, ISaveUserPicture } from '../contracts/repositories'

type Setup = (
  fileStorage: IUploadFile,
  crypto: IUuidGenerator,
  userProfileRepo: ISaveUserPicture & ILoadUserProfile
) => ChangeProfilePicture
type Input = { id: string; file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: Setup =
  (fileStorage, crypto, userProfileRepo) =>
  async ({ id, file }) => {
    let pictureUrl: string | undefined
    if (file !== undefined) {
      pictureUrl = await fileStorage.upload({
        file,
        key: crypto.uuid({ key: id })
      })
    }
    await userProfileRepo.savePicture({ pictureUrl })
    await userProfileRepo.load({ id })
  }

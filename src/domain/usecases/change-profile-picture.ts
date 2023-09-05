import { IUploadFile, IUuidGenerator } from '@/domain/contracts/gateways'

import { ILoadUserProfile, ISaveUserPicture } from '../contracts/repositories'
import { UserProfile } from '../entities'

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
    const data: { pictureUrl?: string; name?: string } = {}
    if (file !== undefined) {
      data.pictureUrl = await fileStorage.upload({
        file,
        key: crypto.uuid({ key: id })
      })
    } else {
      data.name = (await userProfileRepo.load({ id })).name
    }
    const userProfile = new UserProfile(id)
    userProfile.setPicture(data)
    await userProfileRepo.savePicture(userProfile)
  }

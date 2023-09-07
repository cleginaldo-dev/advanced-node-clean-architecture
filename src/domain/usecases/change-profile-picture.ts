import {
  IDeleteFile,
  IUploadFile,
  IUuidGenerator
} from '@/domain/contracts/gateways'

import { ILoadUserProfile, ISaveUserPicture } from '../contracts/repositories'
import { UserProfile } from '../entities'

type Setup = (
  fileStorage: IUploadFile & IDeleteFile,
  crypto: IUuidGenerator,
  userProfileRepo: ISaveUserPicture & ILoadUserProfile
) => ChangeProfilePicture
type Input = { id: string; file?: Buffer }
type Output = { pictureUrl?: string; initials?: string }
export type ChangeProfilePicture = (input: Input) => Promise<Output>

export const setupChangeProfilePicture: Setup =
  (fileStorage, crypto, userProfileRepo) =>
  async ({ id, file }) => {
    const key = crypto.uuid({ key: id })
    const data: { pictureUrl?: string; name?: string } = {}
    if (file !== undefined) {
      data.pictureUrl = await fileStorage.upload({ file, key })
    } else {
      data.name = (await userProfileRepo.load({ id })).name
    }
    const userProfile = new UserProfile(id)
    userProfile.setPicture(data)
    try {
      await userProfileRepo.savePicture(userProfile)
    } catch (error) {
      if (file !== undefined) await fileStorage.delete({ key })
      throw error
    }
    return userProfile
  }

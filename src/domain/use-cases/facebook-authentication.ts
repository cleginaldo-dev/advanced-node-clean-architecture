import { ILoadFacebookUser, ITokenGenerator } from '@/domain/contracts/gateways'
import {
  ISaveFacebookAccount,
  ILoadUserAccount
} from '@/domain/contracts/repositories'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'

type Input = { token: string }
type Output = { accessToken: string }
export type TypeFacebookAuthentication = (params: Input) => Promise<Output>
type Setup = (
  facebook: ILoadFacebookUser,
  userAccountRepo: ILoadUserAccount & ISaveFacebookAccount,
  token: ITokenGenerator
) => TypeFacebookAuthentication

export const setupFacebookAuthentication: Setup =
  (facebook, userAccountRepo, token): TypeFacebookAuthentication =>
  async params => {
    const fbData = await facebook.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await userAccountRepo.load({
        email: fbData.email
      })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await userAccountRepo.saveWithFacebook(fbAccount)
      const accessToken = await token.generate({
        key: id,
        expirationInMs: AccessToken.expirationInMs
      })
      return { accessToken }
    }
    throw new AuthenticationError()
  }

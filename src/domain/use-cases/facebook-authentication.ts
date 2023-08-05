import { AuthenticationError } from '@/domain//entities/errors'
import { ILoadFacebookUserApi } from '@/domain/contracts/apis'
import { ITokenGenerator } from '@/domain/contracts/crypto/token'
import {
  ISaveFacebookAccountRepository,
  ILoadUserAccountRepository
} from '@/domain/contracts/repositories'
import { AccessToken, FacebookAccount } from '@/domain/entities'

type Params = { token: string }
type Result = AccessToken | AuthenticationError
export type TypeFacebookAuthentication = (params: Params) => Promise<Result>
type Setup = (
  facebookApi: ILoadFacebookUserApi,
  userAccountRepo: ILoadUserAccountRepository & ISaveFacebookAccountRepository,
  crypto: ITokenGenerator
) => TypeFacebookAuthentication

export const setupFacebookAuthentication: Setup =
  (facebookApi, userAccountRepo, crypto): TypeFacebookAuthentication =>
  async params => {
    const fbData = await facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await userAccountRepo.load({
        email: fbData.email
      })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await userAccountRepo.saveWithFacebook(fbAccount)
      const token = await crypto.generateToken({
        key: id,
        expirationInMs: AccessToken.expirationInMs
      })
      return new AccessToken(token)
    }

    return new AuthenticationError()
  }

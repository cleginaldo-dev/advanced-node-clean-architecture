import { AuthenticationError } from '@/domain//entities/errors'
import { ILoadFacebookUserApi } from '@/domain/contracts/apis'
import { ITokenGenerator } from '@/domain/contracts/crypto/token'
import {
  ISaveFacebookAccountRepository,
  ILoadUserAccountRepository
} from '@/domain/contracts/repositories'
import { AccessToken, FacebookAccount } from '@/domain/entities'

type Input = { token: string }
type Output = { accessToken: string }
export type TypeFacebookAuthentication = (params: Input) => Promise<Output>
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
      const accessToken = await crypto.generateToken({
        key: id,
        expirationInMs: AccessToken.expirationInMs
      })
      return { accessToken }
    }
    throw new AuthenticationError()
  }

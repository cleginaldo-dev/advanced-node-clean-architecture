import {
  setupFacebookAuthentication,
  TypeFacebookAuthentication
} from '@/domain/use-cases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makeJwtTokenHandler } from '@/main/factories/crypto'
import { makePgUserAccountRepository } from '@/main/factories/repositories'

export const makeFacebookAuthentication = (): TypeFacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepository(),
    makeJwtTokenHandler()
  )
}

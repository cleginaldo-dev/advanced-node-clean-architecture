import {
  setupFacebookAuthentication,
  TypeFacebookAuthentication
} from '@/domain/usecases'
import { makeJwtTokenHandler, makeFacebookApi } from '@/main/factories/gateways'
import { makePgUserAccountRepository } from '@/main/factories/repositories'

export const makeFacebookAuthentication = (): TypeFacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepository(),
    makeJwtTokenHandler()
  )
}

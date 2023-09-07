import {
  setupFacebookAuthentication,
  TypeFacebookAuthentication
} from '@/domain/usecases'
import {
  makeFacebookApi,
  makeJwtTokenHandler
} from '@/main/factories/infra/gateways'
import { makePgUserAccountRepository } from '@/main/factories/infra/repositories'

export const makeFacebookAuthentication = (): TypeFacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepository(),
    makeJwtTokenHandler()
  )
}

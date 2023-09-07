import { AuthenticationMiddleware } from '@/application/middlewares'
import { makeJwtTokenHandler } from '@/main/factories/infra/gateways'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  return new AuthenticationMiddleware(
    makeJwtTokenHandler().validate.bind(makeJwtTokenHandler())
  )
}

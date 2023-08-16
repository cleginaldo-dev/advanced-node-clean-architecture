import { AuthenticationMiddleware } from '@/application/middlewares'
import { makeJwtTokenHandler } from '@/main/factories/crypto'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  return new AuthenticationMiddleware(
    makeJwtTokenHandler().validateToken.bind(makeJwtTokenHandler())
  )
}

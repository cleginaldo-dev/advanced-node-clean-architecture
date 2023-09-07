import { FacebookLoginController } from '@/application/controller'
import { makeFacebookAuthentication } from '@/main/factories/domain/usecases'

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthentication())
}

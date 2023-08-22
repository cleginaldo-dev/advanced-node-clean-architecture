import { FacebookLoginController } from '@/application/controller'
import { makeFacebookAuthentication } from '@/main/factories/usecases'

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthentication())
}

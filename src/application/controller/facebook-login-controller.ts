import { Controller } from '@/application/controller'
import { HttpResponse, success, unauthorized } from '@/application/helpers'
import { ValidationBuilder as B, IValidator } from '@/application/validation'
import { TypeFacebookAuthentication } from '@/domain/usecases'

type httpRequest = { token: string }
type Model = Error | { accessToken: string }

export class FacebookLoginController extends Controller {
  constructor(
    private readonly facebookAuthentication: TypeFacebookAuthentication
  ) {
    super()
  }

  async perform(httpRequest: httpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.facebookAuthentication({
        token: httpRequest.token
      })
      return success(accessToken)
    } catch (error) {
      return unauthorized()
    }
  }

  override buildValidators(httpRequest: httpRequest): IValidator[] {
    const { token } = httpRequest
    return [...B.of({ value: token, fieldName: 'token' }).required().build()]
  }
}

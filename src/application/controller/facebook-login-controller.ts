import { RequiredFieldError } from '@/application/errors';
import {
  badResquest,
  HttpResponse,
  serverError,
  unauthorized,
} from '@/application/helpers';
import { IFacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: IFacebookAuthentication,
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      if (!httpRequest.token) {
        return badResquest(new RequiredFieldError('token'));
      }
      const accessToken = await this.facebookAuthentication.perform({
        token: httpRequest.token,
      });
      if (accessToken instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: accessToken.value,
          },
        };
      }
      return unauthorized();
    } catch (error) {
      return serverError(error);
    }
  }
}

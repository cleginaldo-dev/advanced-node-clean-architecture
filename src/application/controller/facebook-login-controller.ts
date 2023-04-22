import { RequiredFieldError, ServerError } from '@/application/errors';
import { badResquest, HttpResponse } from '@/application/helpers';
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
      const result = await this.facebookAuthentication.perform({
        token: httpRequest.token,
      });
      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: result.value,
          },
        };
      }

      return {
        statusCode: 401,
        data: result,
      };
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error as Error),
      };
    }
  }
}

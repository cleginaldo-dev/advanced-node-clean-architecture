import { RequiredFieldError } from '@/application/errors';
import {
  badResquest,
  HttpResponse,
  serverError,
  success,
  unauthorized,
} from '@/application/helpers';
import { IFacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

type httpRequest = {
  token: string | undefined | null;
};

type Model =
  | Error
  | {
      accessToken: string;
    };

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: IFacebookAuthentication,
  ) {}

  async handle(httpRequest: httpRequest): Promise<HttpResponse<Model>> {
    try {
      if (!httpRequest.token) {
        return badResquest(new RequiredFieldError('token'));
      }
      const accessToken = await this.facebookAuthentication.perform({
        token: httpRequest.token,
      });
      if (accessToken instanceof AccessToken) {
        return success({ accessToken: accessToken.value });
      }
      return unauthorized();
    } catch (error) {
      return serverError(error);
    }
  }
}

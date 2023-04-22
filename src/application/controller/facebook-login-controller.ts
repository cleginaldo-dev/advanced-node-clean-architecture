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
  token: string;
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
      const error = this.validate(httpRequest);
      if (error) {
        return badResquest(error);
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

  private validate(httpRequest: httpRequest): Error | undefined {
    if (!httpRequest.token) {
      return new RequiredFieldError('token');
    }
  }
}

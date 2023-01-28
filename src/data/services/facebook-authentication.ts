import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly LoadFacebookUserTokenApi: ILoadFacebookUserApi,
  ) {}

  async perform(
    params: IFacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    await this.LoadFacebookUserTokenApi.loadUser(params);
    return new AuthenticationError();
  }
}

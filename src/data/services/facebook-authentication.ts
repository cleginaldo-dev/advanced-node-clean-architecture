import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { ILoadUserAccountRepository } from '@/data/contracts/repositories';
import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserTokenApi: ILoadFacebookUserApi,
    private readonly loadUserAccountRepository: ILoadUserAccountRepository,
  ) {}

  async perform(
    params: IFacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserTokenApi.loadUser(params);
    if (fbData !== undefined) {
      await this.loadUserAccountRepository.load({ email: fbData.email });
    }
    return new AuthenticationError();
  }
}

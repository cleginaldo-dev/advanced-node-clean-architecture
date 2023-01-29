import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import {
  ICreateFacebookAccountRepository,
  ILoadUserAccountRepository,
} from '@/data/contracts/repositories';
import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserTokenApi: ILoadFacebookUserApi,
    private readonly loadUserAccountRepository: ILoadUserAccountRepository,
    private readonly createFacebookAccountRepository: ICreateFacebookAccountRepository,
  ) {}

  async perform(
    params: IFacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserTokenApi.loadUser(params);
    if (fbData !== undefined) {
      await this.loadUserAccountRepository.load({ email: fbData.email });

      await this.createFacebookAccountRepository.createFromFacebook(fbData);
    }

    return new AuthenticationError();
  }
}

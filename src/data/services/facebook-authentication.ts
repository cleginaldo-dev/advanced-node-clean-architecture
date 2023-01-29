import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import {
  ICreateFacebookAccountRepository,
  ILoadUserAccountRepository,
  IUpdateFacebookAccountRepository,
} from '@/data/contracts/repositories';
import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepo: ILoadUserAccountRepository &
      ICreateFacebookAccountRepository &
      IUpdateFacebookAccountRepository,
  ) {}

  async perform(
    params: IFacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({
        email: fbData.email,
      });
      if (accountData !== undefined) {
        await this.userAccountRepo.updateWithFacebook({
          id: accountData.id,
          name: accountData.name ?? fbData.name,
          facebook_id: fbData.facebook_id,
        });
      } else {
        await this.userAccountRepo.createFromFacebook(fbData);
      }
    }

    return new AuthenticationError();
  }
}

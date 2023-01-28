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
class LoadFacebookUserApiSpy implements ILoadFacebookUserApi {
  token?: string;
  result = undefined;
  async loadUser(
    params: ILoadFacebookUserApi.Params,
  ): Promise<ILoadFacebookUserApi.Result> {
    this.token = params.token;
    return this.result;
  }
}

describe('FacebookAuthentication', () => {
  it('Should be able call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApi.token).toBe('any_token');
  });

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    loadFacebookUserApi.result = undefined;
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});

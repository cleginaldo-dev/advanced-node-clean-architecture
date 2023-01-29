import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';
import { mock } from 'jest-mock-extended';

describe('FacebookAuthentication', () => {
  it('Should be able call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = mock<ILoadFacebookUserApi>();
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token',
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = mock<ILoadFacebookUserApi>();
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});

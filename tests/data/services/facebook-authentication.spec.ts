import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { ILoadUserAccountRepository } from '@/data/contracts/repositories';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';
import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthentication', () => {
  let loadFacebookUserApi: MockProxy<ILoadFacebookUserApi>;
  let loadUserAccountRepo: MockProxy<ILoadUserAccountRepository>;
  let sut: FacebookAuthenticationService;
  const token = 'any_token';

  beforeEach(() => {
    loadFacebookUserApi = mock();
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebook_id: 'any_fb_facebook_id',
    });
    loadUserAccountRepo = mock();
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo,
    );
  });

  it('Should be able call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('Should call LoadUserByEmailRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  });
});

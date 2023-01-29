import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import {
  ICreateFacebookAccountRepository,
  ILoadUserAccountRepository,
} from '@/data/contracts/repositories';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';
import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthentication', () => {
  let facebookApi: MockProxy<ILoadFacebookUserApi>;
  let userAccountRepo: MockProxy<
    ILoadUserAccountRepository & ICreateFacebookAccountRepository
  >;
  let sut: FacebookAuthenticationService;
  const token = 'any_token';

  beforeEach(() => {
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebook_id: 'any_fb_facebook_id',
    });
    userAccountRepo = mock();
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo);
  });

  it('Should be able call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('Should call LoadUserByEmailRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });

    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it('Should call CreateUserFacebookAccountRepo when LoadFacebookUserApi returns data', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined);

    await sut.perform({ token });

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebook_id: 'any_fb_facebook_id',
    });
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1);
  });
});

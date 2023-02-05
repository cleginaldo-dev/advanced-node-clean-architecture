import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { ITokenGenerator } from '@/data/contracts/crypto';
import {
  ILoadUserAccountRepository,
  ISaveFacebookAccountRepository,
} from '@/data/contracts/repositories';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';
import { AccessToken, FacebookAccount } from '@/domain/models';
import { mock, MockProxy } from 'jest-mock-extended';

jest.mock('@/domain/models/facebook-account');

describe('FacebookAuthentication', () => {
  let facebookApi: MockProxy<ILoadFacebookUserApi>;
  let crypto: MockProxy<ITokenGenerator>;
  let userAccountRepo: MockProxy<
    ILoadUserAccountRepository & ISaveFacebookAccountRepository
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
    userAccountRepo.load.mockResolvedValue(undefined);
    userAccountRepo.saveWithFacebook.mockResolvedValue({
      id: 'any_account_id',
    });
    crypto = mock();
    crypto.generateToken.mockResolvedValue('any_generated_token');
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto,
    );
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

  it('Should be able call SaveFacebookAccountRepository with an instance of FacebookAccount', async () => {
    const FacebookAccountStub = jest
      .fn()
      .mockImplementation(() => ({ any: 'any' }));
    jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

    await sut.perform({ token });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any',
    });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('Should be able call TokenGenerator with correct params', async () => {
    await sut.perform({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('Should return an AccessToken on success', async () => {
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AccessToken('any_generated_token'));
  });

  it('Should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error('fb_error'));
  });

  it('Should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error('load_error'));
  });

  it('Should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(
      new Error('save_error'),
    );

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error('save_error'));
  });

  it('Should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error('token_error'));
  });
});

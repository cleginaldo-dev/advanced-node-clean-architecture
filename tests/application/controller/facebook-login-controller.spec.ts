import { FacebookLoginController } from '@/application/controller/facebook-login-controller';
import { ServerError, UnauthorizedError } from '@/application/errors';
import {
  RequiredStringValidator,
  ValidationComposite,
} from '@/application/validation';
import { AuthenticationError } from '@/domain/errors';
import { IFacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { mock, MockProxy } from 'jest-mock-extended';

jest.mock('@/application/validation/composite');

describe('FacebookLoginController', () => {
  let facebookAuth: MockProxy<IFacebookAuthentication>;
  let sut: FacebookLoginController;
  let token: string;
  beforeAll(() => {
    token = 'any_token';
    facebookAuth = mock();
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_token'));
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  it('Should return 400 if validation fails', async () => {
    const error = new Error('validation_error');
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error),
    }));
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy);

    const httpResponse = await sut.handle({ token });

    expect(ValidationCompositeSpy).toHaveBeenCalledWith([
      new RequiredStringValidator('any_token', 'token'),
    ]);
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error,
    });
  });

  it('Should call FacebookAuthentication with corrects params', async () => {
    await sut.handle({ token });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });
  it('Should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });
  it('Should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: token,
      },
    });
  });
  it('Should return 500 if authentication throws', async () => {
    const error = new Error('infra_error');
    facebookAuth.perform.mockRejectedValueOnce(error);
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });
});

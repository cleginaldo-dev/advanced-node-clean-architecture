import { IFacebookAuthentication } from '@/domain/features';
import { mock, MockProxy } from 'jest-mock-extended';

type HttpResponse = {
  statusCode: number;
  data: any;
};

class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: IFacebookAuthentication,
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    await this.facebookAuthentication.perform({ token: httpRequest.token });
    return {
      statusCode: 400,
      data: new Error('The field token is required'),
    };
  }
}
describe('FacebookLoginController', () => {
  let facebookAuth: MockProxy<IFacebookAuthentication>;
  let sut: FacebookLoginController;
  beforeAll(() => {
    facebookAuth = mock();
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  it('Should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });
  it('Should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });
  it('Should return 400 if token is undfined', async () => {
    const httpResponse = await sut.handle({ token: undefined });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });
  it('Should call FacebookAuthentication with corrects params', async () => {
    await sut.handle({ token: 'any_token' });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });
});

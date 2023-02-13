import { ILoadFacebookUserApi } from '@/data/contracts/apis';
import { mock, MockProxy } from 'jest-mock-extended';

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com';
  constructor(private readonly httpClient: IHttpGetClient) {}
  async loadUser(params: ILoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
    });
  }
}

export interface IHttpGetClient {
  get: (params: IHttpGetClient.Params) => Promise<void>;
}

export namespace IHttpGetClient {
  export type Params = {
    url: string;
  };
}

describe('FacebookApi', () => {
  let httpClient: MockProxy<IHttpGetClient>;
  beforeAll(() => {
    httpClient = mock();
  });
  it('Should get app token', async () => {
    const sut = new FacebookApi(httpClient);

    await sut.loadUser({ token: 'any_clent_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
    });
  });
});

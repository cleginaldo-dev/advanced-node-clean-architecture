import { FacebookApi } from '@/infra/apis';
import { AxiosHttpClient } from '@/infra/http';
import { env } from '@/main/config/env';

describe('FacebookApi', () => {
  let axiosClient: AxiosHttpClient;
  let sut: FacebookApi;

  beforeEach(() => {
    axiosClient = new AxiosHttpClient();
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret,
    );
  });

  it('Should return a Facebook User if token is valid', async () => {
    const fbUser = await sut.loadUser({
      token:
        'JHNGDFGMHÇDThbsdfjsj785498-90854830485098458-039480-8349845sfaQEWW',
    });

    expect(fbUser).toEqual({
      facebook_id: '728079287908964',
      email: 'mang_saczvlo_teste@tfbnw.net',
      name: 'Mango Teste',
    });
  });

  it('Should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({
      token: 'invalid',
    });

    expect(fbUser).toBeUndefined();
  });
});

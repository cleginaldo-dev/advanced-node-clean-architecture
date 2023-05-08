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
        'EAADX1utklSkBAKh254JyTuZChInWXaxsSC3UvWUjzzQoCmEev4rheEZB7LP7ZB1ZApXm8lwt9MTrifubesiOZCPIyCP3zB3tiriRjIkZBnFh84VmJXgl3BzaCJvZBS4hubZCWAa2SJX41BhUtqEPP36qHqRdZCpQce7XBNtxZBFhOlo3wT2li4G1HSYTcUCIyIothsTiaGk4ZAIQzSQ7XKlZBQy8B6wIPK36yCnqZAdkdRXfiwZCZCdZBvjNGDZAs',
    });

    expect(fbUser).toEqual({
      facebook_id: '728079287908964',
      email: 'cleginaldo3000@gmail.com',
      name: 'Cleginaldo Bandeiras',
    });
  });

  it('Should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({
      token: 'invalid',
    });

    expect(fbUser).toBeUndefined();
  });
});

import { FacebookApi } from '@/infra/apis';
import { AxiosHttpClient } from '@/infra/http';
import { env } from '@/main/config/env';

export const makeFacebookApi = (): FacebookApi => {
  const axiosClient = new AxiosHttpClient();
  return new FacebookApi(
    axiosClient,
    env.facebookApi.clientId,
    env.facebookApi.clientSecret,
  );
};

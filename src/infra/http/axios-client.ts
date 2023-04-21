/* eslint-disable @typescript-eslint/no-explicit-any */
import { IHttpGetClient } from '@/infra/http';
import axios from 'axios';

export class AxiosHttpClient implements IHttpGetClient {
  async get<T = any>(args: IHttpGetClient.Params): Promise<T> {
    const result = await axios.get(args.url, {
      params: args.params,
    });
    return result.data;
  }
}

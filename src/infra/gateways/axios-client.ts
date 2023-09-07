/* eslint-disable @typescript-eslint/no-explicit-any */
import { IHttpGetClient } from '@/infra/gateways'
import axios from 'axios'

export class AxiosHttpClient implements IHttpGetClient {
  async get<T = any>(args: IHttpGetClient.Input): Promise<T> {
    const result = await axios.get(args.url, {
      params: args.params
    })
    return result.data
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IHttpGetClient {
  get: <T = any>(params: IHttpGetClient.Params) => Promise<T>
}

export namespace IHttpGetClient {
  export type Params = {
    url: string
    params: object
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IHttpGetClient {
  get: <T = any>(params: IHttpGetClient.Input) => Promise<T>
}

export namespace IHttpGetClient {
  export type Input = {
    url: string
    params: object
  }
}

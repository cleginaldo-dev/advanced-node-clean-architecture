export interface ILoadFacebookUserApi {
  loadUser: (
    params: ILoadFacebookUserApi.Params,
  ) => Promise<ILoadFacebookUserApi.Result>;
}

export namespace ILoadFacebookUserApi {
  export type Params = {
    token: string;
  };
  export type Result =
    | undefined
    | {
        facebook_id: string;
        email: string;
        name: string;
      };
}

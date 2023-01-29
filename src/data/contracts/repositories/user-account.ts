export interface ILoadUserAccountRepository {
  load(params: ILoadUserAccountRepository.Params): Promise<void>;
}

export namespace ILoadUserAccountRepository {
  export type Params = {
    email: string;
  };
}

export interface ICreateFacebookAccountRepository {
  createFromFacebook(
    params: ICreateFacebookAccountRepository.Params,
  ): Promise<void>;
}

export namespace ICreateFacebookAccountRepository {
  export type Params = {
    name: string;
    email: string;
    facebook_id: string;
  };
}

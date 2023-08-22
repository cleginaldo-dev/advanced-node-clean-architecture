export interface ILoadFacebookUser {
  loadUser: (
    params: ILoadFacebookUser.Input
  ) => Promise<ILoadFacebookUser.Output>
}

export namespace ILoadFacebookUser {
  export type Input = {
    token: string
  }
  export type Output =
    | undefined
    | {
        facebook_id: string
        email: string
        name: string
      }
}

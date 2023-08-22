export interface ILoadUserAccount {
  load(params: ILoadUserAccount.Input): Promise<ILoadUserAccount.Output>
}

export namespace ILoadUserAccount {
  export type Input = {
    email: string
  }
  export type Output =
    | undefined
    | {
        id: string
        name?: string
      }
}

export interface ISaveFacebookAccount {
  saveWithFacebook(
    params: ISaveFacebookAccount.Input
  ): Promise<ISaveFacebookAccount.Output>
}

export namespace ISaveFacebookAccount {
  export type Input = {
    id?: string
    name: string
    email: string
    facebook_id: string
  }

  export type Output = {
    id: string
  }
}

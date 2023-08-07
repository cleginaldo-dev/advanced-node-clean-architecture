export interface ILoadUserAccountRepository {
  load(
    params: ILoadUserAccountRepository.Input
  ): Promise<ILoadUserAccountRepository.Output>
}

export namespace ILoadUserAccountRepository {
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

export interface ISaveFacebookAccountRepository {
  saveWithFacebook(
    params: ISaveFacebookAccountRepository.Input
  ): Promise<ISaveFacebookAccountRepository.Output>
}

export namespace ISaveFacebookAccountRepository {
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

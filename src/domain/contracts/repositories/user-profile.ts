export interface ISaveUserPicture {
  savePicture(params: ISaveUserPicture.Input): Promise<ISaveUserPicture.Output>
}

export namespace ISaveUserPicture {
  export type Input = { id: string; pictureUrl?: string; initials?: string }
  export type Output = void
}

export interface ILoadUserProfile {
  load(params: ILoadUserProfile.Input): Promise<ILoadUserProfile.Output>
}

export namespace ILoadUserProfile {
  export type Input = { id: string }
  export type Output = { name?: string }
}

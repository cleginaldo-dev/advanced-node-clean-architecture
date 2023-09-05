export interface ISaveUserPicture {
  savePicture(params: ISaveUserPicture.Input): Promise<ISaveUserPicture.Output>
}

export namespace ISaveUserPicture {
  export type Input = { pictureUrl?: string }
  export type Output = void
}

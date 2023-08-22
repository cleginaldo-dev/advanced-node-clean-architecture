export interface IUuidGenerator {
  uuid: (input: IUuidGenerator.Input) => IUuidGenerator.Output
}

export namespace IUuidGenerator {
  export type Input = { key: string }
  export type Output = string
}

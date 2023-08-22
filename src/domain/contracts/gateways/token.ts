export interface ITokenGenerator {
  generate: (params: ITokenGenerator.Input) => Promise<ITokenGenerator.Output>
}

export namespace ITokenGenerator {
  export type Input = {
    key: string
    expirationInMs: number
  }
  export type Output = string
}

export interface ITokenValidator {
  validate: (params: ITokenValidator.Input) => Promise<ITokenValidator.Output>
}

export namespace ITokenValidator {
  export type Input = { token: string }
  export type Output = string
}

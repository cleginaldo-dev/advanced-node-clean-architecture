import { ITokenValidator } from '@/domain/contracts/crypto'

type Input = { token: string }
type Output = string

export type Authorize = (params: Input) => Promise<Output>
type Setup = (crypto: ITokenValidator) => Authorize

export const setupAuthorize: Setup = crypto => async params => {
  return crypto.validateToken(params)
}
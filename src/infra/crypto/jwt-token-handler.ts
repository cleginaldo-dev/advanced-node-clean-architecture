import {
  ITokenGenerator,
  ITokenValidator
} from '@/domain/contracts/crypto/token'
import { sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements ITokenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken(
    params: ITokenGenerator.Params
  ): Promise<ITokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000
    return sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds
    })
  }

  async validateToken({ token }: ITokenValidator.Params): Promise<void> {
    verify(token, this.secret)
  }
}

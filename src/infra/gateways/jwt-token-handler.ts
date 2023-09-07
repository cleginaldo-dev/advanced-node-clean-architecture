import { ITokenGenerator, ITokenValidator } from '@/domain/contracts/gateways'
import { JwtPayload, sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements ITokenGenerator, ITokenValidator {
  constructor(private readonly secret: string) {}

  async generate(
    params: ITokenGenerator.Input
  ): Promise<ITokenGenerator.Output> {
    const expirationInSeconds = params.expirationInMs / 1000
    return sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds
    })
  }

  async validate({
    token
  }: ITokenValidator.Input): Promise<ITokenValidator.Output> {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }
}

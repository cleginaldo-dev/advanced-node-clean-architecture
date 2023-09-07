import { IUuidGenerator } from '@/domain/contracts/gateways'
import { v4 } from 'uuid'

export class UuidHandler implements IUuidGenerator {
  uuid({ key }: IUuidGenerator.Input): IUuidGenerator.Output {
    return `${key}_${v4()}`
  }
}

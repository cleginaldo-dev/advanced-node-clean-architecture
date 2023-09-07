import { IUuidGenerator } from '@/domain/contracts/gateways'

export class UniqueId implements IUuidGenerator {
  constructor(private date: Date) {}

  uuid({ key }: IUuidGenerator.Input): IUuidGenerator.Output {
    return `${key}_${this.date.getFullYear()}${(this.date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${this.date
      .getDate()
      .toString()
      .padStart(2, '0')}${this.date
      .getHours()
      .toString()
      .padStart(2, '0')}${this.date
      .getMinutes()
      .toString()
      .padStart(2, '0')}${this.date.getSeconds().toString().padStart(2, '0')}`
  }
}

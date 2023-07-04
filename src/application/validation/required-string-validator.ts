import { RequiredFieldError } from '@/application/errors'
import { IValidator } from '@/application/validation'

export class RequiredStringValidator implements IValidator {
  constructor(
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  validate(): Error | undefined {
    if (this.value === '' || this.value === null || this.value === undefined) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}

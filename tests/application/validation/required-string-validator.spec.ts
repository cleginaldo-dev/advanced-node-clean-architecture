import { RequiredFieldError } from '@/application/errors';

class RequiredStringValidator {
  constructor(
    private readonly value: string,
    private readonly fieldName: string,
  ) {}

  validate(): Error | undefined {
    if (this.value === '' || this.value === null || this.value === undefined) {
      return new RequiredFieldError(this.fieldName);
    }
  }
}
describe('RequiredStringValidator', () => {
  beforeAll(() => {});

  beforeEach(() => {});

  it('Should return RequiredFieldError if value is empty', async () => {
    const sut = new RequiredStringValidator('', 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });
  it('Should return RequiredFieldError if value is null', async () => {
    const sut = new RequiredStringValidator(null as any, 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });
  it('Should return RequiredFieldError if value is undefined', async () => {
    const sut = new RequiredStringValidator(undefined as any, 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });
  it('Should return undefined on success', async () => {
    const sut = new RequiredStringValidator('any_value', 'any_field');

    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});

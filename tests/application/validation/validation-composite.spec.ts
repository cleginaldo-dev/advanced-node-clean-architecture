import { MockProxy, mock } from 'jest-mock-extended';

export interface IValidator {
  validate: () => Error | undefined;
}

export class ValidationComposite implements IValidator {
  constructor(private readonly validators: IValidator[]) {}

  validate(): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.validate();
      if (error !== undefined) {
        return error;
      }
    }
  }
}
describe('ValidationComposite', () => {
  let validators: IValidator[];
  let validator1: MockProxy<IValidator>;
  let validator2: MockProxy<IValidator>;
  let sut: ValidationComposite;
  beforeAll(() => {
    validator1 = mock();
    validator2 = mock();
    validators = [validator1, validator2];
  });

  beforeEach(() => {
    sut = new ValidationComposite(validators);
  });

  it('Should return undefined if all Validators returns undefined', async () => {
    const error = sut.validate();

    expect(error).toBeUndefined();
  });
  it('Should return the first error', async () => {
    validator1.validate.mockReturnValueOnce(new Error('error_1'));
    validator2.validate.mockReturnValueOnce(new Error('error_2'));

    const error = sut.validate();

    expect(error).toEqual(new Error('error_1'));
  });
});

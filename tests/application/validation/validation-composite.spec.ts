import { MockProxy, mock } from 'jest-mock-extended';

export interface IValidator {
  validate: () => Error | undefined;
}

export class ValidationComposite {
  constructor(private readonly validators: IValidator[]) {}

  validate(): undefined {
    return undefined;
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
});

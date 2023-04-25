import {
  RequiredStringValidator,
  ValidationBuilder,
} from '@/application/validation';

describe('ValidationBuilder', () => {
  it('Should return a RequiredStringValidator', async () => {
    const validators = ValidationBuilder.of({
      value: 'any_value',
      fieldName: 'any_name',
    })
      .required()
      .build();

    expect(validators).toEqual([
      new RequiredStringValidator('any_value', 'any_name'),
    ]);
  });
});

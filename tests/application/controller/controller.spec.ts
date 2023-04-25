import { Controller } from '@/application/controller';
import { ServerError } from '@/application/errors';
import { HttpResponse } from '@/application/helpers';
import { ValidationComposite } from '@/application/validation';

jest.mock('@/application/validation/composite');

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data',
  };

  async perform(_httpRequest: any): Promise<HttpResponse> {
    return this.result;
  }
}
describe('Controller', () => {
  let sut: ControllerStub;

  beforeEach(() => {
    sut = new ControllerStub();
  });

  it('Should return 400 if validation fails', async () => {
    const error = new Error('validation_error');
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error),
    }));
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy);

    const httpResponse = await sut.handle('any_value');

    expect(ValidationCompositeSpy).toHaveBeenCalledWith([]);
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error,
    });
  });

  it('Should return 500 if authentication throws', async () => {
    const error = new Error('infra_error');
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error);

    const httpResponse = await sut.handle('any_value');

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });

  it('Should return some result as perform', async () => {
    const httpResponse = await sut.handle('any_value');

    expect(httpResponse).toEqual(sut.result);
  });
});

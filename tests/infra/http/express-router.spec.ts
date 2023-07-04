import { Controller } from '@/application/controller';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { Request, Response } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';

export class ExpressRouter {
  constructor(private readonly controler: Controller) {}

  public async adapt(req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controler.handle({ ...req.body });
    res.status(200).json(httpResponse.data);
  }
}

describe('ExpressRouter', () => {
  let req: Request;
  let res: Response;
  let controller: MockProxy<Controller>;
  let sut: ExpressRouter;
  beforeAll(() => {
    req = getMockReq({ body: { any: 'any' } });
    res = getMockRes().res;
    controller = mock();
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: { data: 'any_data' },
    });
  });

  beforeEach(() => {
    sut = new ExpressRouter(controller);
  });

  it('Should be able call handle with request correct', async () => {
    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' });
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });
  it('Should be able call handle with enpty request', async () => {
    req = getMockReq();
    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({});
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });
  it('Should respond with 200 and correct data', async () => {
    await sut.adapt(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: 'any_data' });
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });
});

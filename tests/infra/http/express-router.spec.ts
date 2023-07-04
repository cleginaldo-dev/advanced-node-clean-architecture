import { Controller } from '@/application/controller';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { Request, Response } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';

export class ExpressRouter {
  constructor(private readonly controler: Controller) {}

  public async adapt(req: Request, _res: Response): Promise<void> {
    await this.controler.handle({ ...req.body });
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
});

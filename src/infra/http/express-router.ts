import { Controller } from '@/application/controller';
import { Request, Response } from 'express';

export class ExpressRouter {
  constructor(private readonly controler: Controller) {}

  public async adapt(req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controler.handle({ ...req.body });
    if (httpResponse.statusCode === 200) {
      res.status(httpResponse.statusCode).json(httpResponse.data);
    } else {
      res
        .status(httpResponse.statusCode)
        .json({ error: httpResponse.data.message });
    }
  }
}

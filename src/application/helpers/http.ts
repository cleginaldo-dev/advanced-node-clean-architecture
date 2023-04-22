import { ServerError, UnauthorizedError } from '@/application/errors';

export type HttpResponse = {
  statusCode: number;
  data: any;
};

export const badResquest = (error: Error): HttpResponse => ({
  statusCode: 400,
  data: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  data: new UnauthorizedError(),
});

export const serverError = (error: Error | unknown): HttpResponse => ({
  statusCode: 500,
  data: new ServerError(error as Error),
});

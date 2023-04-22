import { ServerError, UnauthorizedError } from '@/application/errors';

export type HttpResponse<T = any> = {
  statusCode: number;
  data: T;
};

export const success = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 200,
  data,
});

export const badResquest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  data: error,
});

export const unauthorized = (): HttpResponse<Error> => ({
  statusCode: 401,
  data: new UnauthorizedError(),
});

export const serverError = (error: Error | unknown): HttpResponse<Error> => ({
  statusCode: 500,
  data: new ServerError(error as Error),
});

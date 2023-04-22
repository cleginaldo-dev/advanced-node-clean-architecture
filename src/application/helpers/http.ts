/* eslint-disable @typescript-eslint/no-explicit-any */
export type HttpResponse = {
  statusCode: number;
  data: any;
};

export const badResquest = (error: Error): HttpResponse => ({
  statusCode: 400,
  data: error,
});

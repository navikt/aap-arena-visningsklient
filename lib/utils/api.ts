export type FetchResponse<ResponseType> = SuccessResponseBody<ResponseType> | ErrorResponseBody;

export type ErrorResponseBody = {
  type: 'ERROR';
  status: number;
};

type SuccessResponseBody<ResponseType> = {
  type: 'SUCCESS';
  status?: number;
  data: ResponseType;
};

export const isError = (res?: FetchResponse<unknown>): res is ErrorResponseBody => (res && res.type === 'ERROR')!!;

export const isSuccess = <T>(res?: FetchResponse<T>): res is SuccessResponseBody<T> =>
  (res && res.type === 'SUCCESS')!!;

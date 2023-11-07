export type SuccessResult<T> = {
  success: true;
  result: T;
};
export type ErrorResult = {
  success: false;
  error: string;
  code: number;
};

export type Result<T> = SuccessResult<T> | ErrorResult;

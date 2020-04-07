export default class ApiError extends Error {
  httpStatus: number;
  code: string;
  defaultError?: Error;

  constructor(httpStatus: number, code: string, message: string, defaultError?: Error) {
    super(message);
    this.httpStatus = httpStatus;
    this.code = code;
    this.defaultError = defaultError;
  }
}

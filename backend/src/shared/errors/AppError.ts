import { HTTPStatusCodes } from "../enums/HTTPStatusCodes";
export class AppError extends Error {
  public readonly statusCode: number;
  constructor(
    message: string,
    statusCode: HTTPStatusCodes = HTTPStatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

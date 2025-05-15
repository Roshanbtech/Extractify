import { Request, Response, NextFunction } from "express";
import { HTTPStatusCodes } from "../shared/enums/HTTPStatusCodes";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof Error && typeof (err as any).statusCode === "number") {
    res.status((err as any).statusCode).json({ message: err.message });
  } else if (err instanceof Error) {
    res
      .status(HTTPStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  } else {
    res
      .status(HTTPStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Unknown error occurred" });
  }
};

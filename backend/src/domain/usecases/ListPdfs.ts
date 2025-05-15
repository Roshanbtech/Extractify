import { IUserRepository } from "../repositories/IUserRepository";
import { AppError } from "../../shared/errors/AppError";
import { HTTPStatusCodes } from "../../shared/enums/HTTPStatusCodes";
import { PdfSubdoc } from "../entities/PdfSubdoc";

export class ListPdfs {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(userId: string): Promise<PdfSubdoc[]> {
    try {
      return await this.userRepo.listDocuments(userId);
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;
      throw new AppError(
        "Failed to list PDFs",
        HTTPStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
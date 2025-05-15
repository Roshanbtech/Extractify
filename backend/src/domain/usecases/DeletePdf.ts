import { IPdfFileRepository } from "../repositories/IPdfFileRepository";
import { IUserRepository } from "../repositories/IUserRepository";
import { AppError } from "../../shared/errors/AppError";
import { HTTPStatusCodes } from "../../shared/enums/HTTPStatusCodes";

export class DeletePdfFile {
  constructor(
    private readonly pdfRepo: IPdfFileRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(userId: string, publicId: string): Promise<void> {
    try {
      const owns = await this.userRepo.hasDocument(userId, publicId);
      if (!owns) {
        throw new AppError("Forbidden", HTTPStatusCodes.FORBIDDEN);
      }
      await this.pdfRepo.delete({ userId, publicId });
      await this.userRepo.removeDocument(userId, publicId);
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;
      throw new AppError(
        "Failed to delete PDF",
        HTTPStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

import { IPdfFileRepository } from "../repositories/IPdfFileRepository";
import { IUserRepository } from "../repositories/IUserRepository";
import { PdfSubdoc } from "../entities/PdfSubdoc";
import { AppError } from "../../shared/errors/AppError";
import { HTTPStatusCodes } from "../../shared/enums/HTTPStatusCodes";

export class UploadPdfFile {
  constructor(
    private readonly pdfRepo: IPdfFileRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(
    userId: string,
    fileBuffer: Buffer,
    originalName: string
  ): Promise<PdfSubdoc> {
    try {
      const { publicId, url } = await this.pdfRepo.saveOriginal({ userId, fileBuffer, originalName });
      const subdoc = new PdfSubdoc(publicId, url, originalName, new Date());
      await this.userRepo.addDocument(userId, subdoc);
      return subdoc;
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;
      throw new AppError(
        "Failed to upload PDF",
        HTTPStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
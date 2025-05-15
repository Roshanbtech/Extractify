import { IPdfFileRepository } from "../repositories/IPdfFileRepository";
import { IUserRepository } from "../repositories/IUserRepository";
import { PdfSubdoc } from "../entities/PdfSubdoc";
import { AppError } from "../../shared/errors/AppError";
import { HTTPStatusCodes } from "../../shared/enums/HTTPStatusCodes";

export class ExtractPdfPages {
  constructor(
    private readonly pdfRepo: IPdfFileRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(
    userId: string,
    publicId: string,
    pages: number[],
    order?: number[]
  ): Promise<PdfSubdoc> {
    try {
      const owns = await this.userRepo.hasDocument(userId, publicId);
      if (!owns) {
        throw new AppError("Forbidden", HTTPStatusCodes.FORBIDDEN);
      }
      const { publicId: newId, url } = await this.pdfRepo.extractPages({
        userId,
        publicId,
        pages,
        order,
      });
      const subdoc = new PdfSubdoc(newId, url, `${newId}.pdf`, new Date());
      await this.userRepo.addDocument(userId, subdoc);
      return subdoc;
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;
      throw new AppError(
        "Failed to extract pages",
        HTTPStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
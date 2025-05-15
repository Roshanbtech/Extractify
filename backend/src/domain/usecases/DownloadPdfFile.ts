import { IPdfFileRepository } from "../repositories/IPdfFileRepository";
import { IUserRepository } from "../repositories/IUserRepository";
import { AppError } from "../../shared/errors/AppError";
import { HTTPStatusCodes } from "../../shared/enums/HTTPStatusCodes";

export class DownloadPdfFile {
  constructor(
    private readonly pdfRepo: IPdfFileRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(userId: string, publicId: string): Promise<string> {
    try {
      console.log("Checking ownership for:", publicId);

      const owns = await this.userRepo.hasDocument(userId, publicId);
      
      // console.log("Fetching signed URL for:", publicId);
      const signedUrl = this.pdfRepo.getSignedUrl(publicId);
      console.log("Cloudinary Signed URL:", signedUrl);

      return signedUrl;
    } catch (err: unknown) {
      console.error("Error in DownloadPdfFile.execute:", err);

      if (err instanceof AppError) throw err;
      throw new AppError(
        "Failed to generate download URL",
        HTTPStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

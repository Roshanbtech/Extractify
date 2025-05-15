import { IPdfFileRepository } from "../../domain/repositories/IPdfFileRepository";
import { AppError } from "../../shared/errors/AppError";
import { HTTPStatusCodes } from "../../shared/enums/HTTPStatusCodes";
import { PDFDocument } from 'pdf-lib';
import fetch from "node-fetch";
import cloudinary from "../../config/cloudinaryConfig";

export class CloudinaryPdfRepository implements IPdfFileRepository {

  async saveOriginal({
    userId,
    fileBuffer,
    originalName
  }: {
    userId: string;
    fileBuffer: Buffer;
    originalName: string;
  }): Promise<{ publicId: string; url: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder:        `pdfs/${userId}/original`,
          public_id:     originalName.replace(/\.pdf$/, ""),
          type:          "authenticated"
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              new AppError(
                "Cloudinary upload failed",
                HTTPStatusCodes.INTERNAL_SERVER_ERROR
              )
            );
          }
  
          const signedUrl = cloudinary.url(result.public_id, {
            resource_type: "raw",
            type:          "authenticated",
            sign_url:      true,
            secure:        true
          });
  
          resolve({ publicId: result.public_id, url: signedUrl });
        }
      );
  
      stream.end(fileBuffer);
    });
  }  

  // infrastructure/pdf/CloudinaryPdfRepository.ts
// async extractPages({ userId, publicId, pages, order }: { userId: string; publicId: string; pages: number[]; order?: number[]; }): Promise<{ publicId: string; url: string }> {
//   try {
//     const signedUrl = cloudinary.url(publicId, {
//       resource_type: 'raw',
//       type: 'authenticated',    // ← was 'upload'
//       sign_url: true,           // ← uncomment / add
//       secure: true,
//       expires_at: Math.floor(Date.now() / 1000) + 60,
//     });
    
//     const resp = await fetch(signedUrl);
//     if (!resp.ok) throw new Error('Failed to fetch original PDF');
//     const existingBytes = Buffer.from(await resp.arrayBuffer());

//     // Load existing PDF
//     const pdf = await PDFDocument.load(existingBytes);

//     // Create new PDF
//     const newPdf = await PDFDocument.create();
//     const copiedPages = await newPdf.copyPages(pdf, pages.map(p => p - 1));
//     copiedPages.forEach(page => newPdf.addPage(page));

//     // Apply page reordering
//     if (order && order.length === copiedPages.length) {
//       const reorderedPages = order.map(i => i - 1);
//       const reorderedDoc = await PDFDocument.create();
//       const reorderedCopies = await reorderedDoc.copyPages(newPdf, reorderedPages);
//       reorderedCopies.forEach(pg => reorderedDoc.addPage(pg));
//       Object.assign(newPdf, reorderedDoc);
//     }

//     // Save extracted PDF
//     const buffer = await newPdf.save();
//     return await this.saveOriginal({
//       userId,
//       fileBuffer: Buffer.from(buffer),
//       originalName: `${publicId}_extracted_${Date.now()}.pdf` 
//     });
//   } catch (err) {
//     throw new AppError('Extraction failed', HTTPStatusCodes.INTERNAL_SERVER_ERROR);
//   }
// }

async extractPages({ userId, publicId, pages, order }: { userId: string; publicId: string; pages: number[]; order?: number[]; }): Promise<{ publicId: string; url: string }> {
  try {
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      type: 'authenticated',
      sign_url: true,
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + 60,
    });

    const resp = await fetch(signedUrl);
    if (!resp.ok) throw new Error('Failed to fetch original PDF');
    const existingBytes = Buffer.from(await resp.arrayBuffer());

    // Load the original PDF
    const pdf = await PDFDocument.load(existingBytes);

    // Ensure pages are extracted in the exact order specified
    const newPdf = await PDFDocument.create();
    const orderedPages = order && order.length === pages.length ? order : pages;

    const copiedPages = await newPdf.copyPages(pdf, orderedPages.map(p => p - 1));
    copiedPages.forEach(page => newPdf.addPage(page));  // Adds pages in correct order

    // Save extracted PDF
    const buffer = await newPdf.save();
    return await this.saveOriginal({
      userId,
      fileBuffer: Buffer.from(buffer),
      originalName: `${publicId}_extracted_${Date.now()}.pdf`
    });
  } catch (err) {
    throw new AppError('Extraction failed', HTTPStatusCodes.INTERNAL_SERVER_ERROR);
  }
}


// getSignedUrl(publicId: string): string {
//   return cloudinary.url(publicId, {
//     resource_type: "raw",
//     type: "upload", 
//     secure: true,
//     format: "pdf",
//   });
// }getSignedUrl(publicId: string): string {
  getSignedUrl(publicId: string): string {
    const formattedPublicId = publicId.replace(/\.pdf$/, ""); return cloudinary.url(formattedPublicId, {
      resource_type: "raw",
      type: "authenticated",
      sign_url: true,
      secure: true,
      // format: "pdf",
      expires_at: Math.floor(Date.now() / 1000) + 60,
    });    
  }
  





  async delete({ userId, publicId }: { userId: string; publicId: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: 'raw', type: 'authenticated' },
        (error, result) => {
          if (error || result?.result !== 'ok') {
            return reject(new AppError('Cloudinary delete failed', HTTPStatusCodes.INTERNAL_SERVER_ERROR));
          }
          resolve();
        }
      );
    });
  }
}
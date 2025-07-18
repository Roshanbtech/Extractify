import { Request, Response, NextFunction } from 'express';
import { UploadPdfFile } from '../../domain/usecases/UploadPdfFile';
import { ListPdfs } from '../../domain/usecases/ListPdfs';
import { ExtractPdfPages } from '../../domain/usecases/ExtractPdfPages';
import { DeletePdfFile } from '../../domain/usecases/DeletePdf';
import { DownloadPdfFile } from '../../domain/usecases/DownloadPdfFile';
import { CloudinaryPdfRepository } from '../../infrastructure/pdf/CloudinaryPdfRepository';
import { UserRepository } from '../../infrastructure/database/UserRepository';
import { HTTPStatusCodes } from '../../shared/enums/HTTPStatusCodes';
import fetch from 'node-fetch'; 
import { AppError } from '../../shared/errors/AppError';
const pdfRepo = new CloudinaryPdfRepository();
const userRepo = new UserRepository();

export class PdfController {
  static async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const file = req.file;
      if (!file) {
         res.status(HTTPStatusCodes.BAD_REQUEST).json({ message: 'No file provided' });
          return;
      }
      const usecase = new UploadPdfFile(pdfRepo, userRepo);
      const doc = await usecase.execute(userId, file.buffer, file.originalname);
      res.status(HTTPStatusCodes.CREATED).json({ document: doc });
    } catch (err) {
      next(err);
    }
  }


  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const usecase = new ListPdfs(userRepo);
      const docs = await usecase.execute(userId);
  
      // map to your own download endpoint
      const safeDocs = docs.map(d => ({
        publicId:     d.publicId,
        originalName: d.originalName,
        createdAt:    d.createdAt,
        url:          `/pdf/download?publicId=${encodeURIComponent(d.publicId)}`
      }));
  
      res.status(HTTPStatusCodes.OK).json({ documents: safeDocs });
    } catch (err) {
      next(err);
    }
  }

  static async extract(req: Request, res: Response, next: NextFunction) {
    try {
      const { publicId, pages, order } = req.body;
      const userId = req.user!.id;
      const usecase = new ExtractPdfPages(pdfRepo, userRepo);
      const extracted = await usecase.execute(userId, publicId, pages, order);
      res.status(HTTPStatusCodes.CREATED).json({ document: extracted });
    } catch (err) {
      next(err);
    }
  }

  // static async delete(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const userId = req.user!.id;
  //     const publicId = req.params.publicId;
  //     const usecase = new DeletePdfFile(pdfRepo, userRepo);
  //     await usecase.execute(userId, publicId);
  //     res.status(HTTPStatusCodes.NO_CONTENT).end();
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId   = req.user!.id;
      const publicId = req.body.publicId as string;   
  
      if (!publicId) {
        throw new AppError("No publicId provided", HTTPStatusCodes.BAD_REQUEST);
      }
  
      await new DeletePdfFile(pdfRepo, userRepo).execute(userId, publicId);
      res.status(HTTPStatusCodes.NO_CONTENT).end();
    } catch (err) {
      next(err);
    }
  }
 


  // static async download(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const userId = req.user!.id;
  //     const publicId = req.params.publicId;
  
  //     if (!publicId) throw new AppError("No publicId provided", 400);
  
  //     const usecase = new DownloadPdfFile(pdfRepo, userRepo);
  //     const signedUrl = await usecase.execute(userId, publicId);
  
  //     console.log("🚀 Fetching PDF from Cloudinary:", signedUrl);
  
  //     const upstream = await fetch(signedUrl);
  //     if (!upstream.ok) {
  //       console.error("❌ Cloudinary Fetch Failed:", upstream.status);
  //       res.status(500).json({ message: `Cloudinary fetch failed: ${upstream.status}` });
  //       return;
  //     }
  
  //     res.setHeader("Content-Type", "application/pdf");
  //     res.setHeader("Access-Control-Allow-Origin", "*"); // ✅ Fix CORS issue
  //     upstream.body!.pipe(res);
  //   } catch (err) {
  //     next(err);
  //   }
  // }
  
  static async download(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      // const publicId = req.params.publicId;
      const publicId = (req.query.publicId ?? req.query.publicid) as string;
  
      if (!publicId) throw new AppError("No publicId provided", 400);
  
      const usecase = new DownloadPdfFile(pdfRepo, userRepo);
      const signedUrl = await usecase.execute(userId, publicId);
      console.log("Fetching PDF from Cloudinary:", signedUrl);
  
      const upstream = await fetch(signedUrl);
      if (!upstream.ok) {
        console.error(" Cloudinary Fetch Failed:", upstream.status);
        res.status(500).json({ message: `Cloudinary fetch failed: ${upstream.status}` });
        return;
      }
  
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");
      upstream.body!.pipe(res);
    } catch (err) {
      next(err);
    }
  }

}
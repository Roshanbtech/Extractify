import multer from 'multer';
import { MulterError } from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
    fieldSize: 10 * 1024 * 1024, 
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/x-pdf', 'application/octet-stream'];
    if (!allowedTypes.includes(file.mimetype)) {
      const err = new MulterError('LIMIT_UNEXPECTED_FILE');
      err.message = 'Invalid file type. Only PDF files are allowed.';
      return cb(err);
    }
    cb(null, true);
  },
});
import { Router } from 'express';
import { PdfController } from '../controllers/PdfController';
import { upload } from '../../config/mutlerConfig'; 

const router = Router();

router.post('/upload', upload.single('pdf'), PdfController.upload);
router.get('/list', PdfController.list);
router.post('/extract', PdfController.extract);
// router.delete('/:publicId', PdfController.delete);
// router.get('/download/:publicId', PdfController.download);
router.get   ('/download', PdfController.download);
router.delete('/delete',   PdfController.delete);



export default router;
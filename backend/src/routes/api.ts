import { Router } from 'express';
import multer from 'multer';
import { analyzeResume, optimizeSummary } from '../controllers/analyzeController';

const router = Router();

// Configure multer for memory storage (we don't need to save the PDF to disk)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.post('/analyze', upload.single('resume'), analyzeResume);
router.post('/optimize-summary', optimizeSummary);

export default router;

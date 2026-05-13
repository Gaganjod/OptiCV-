import { Request, Response } from 'express';
import { extractTextFromPDFBuffer } from '../services/pdfService';
import { analyzeResumeWithAI, optimizeSummaryWithAI } from '../services/aiService';

export const analyzeResume = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
             res.status(400).json({ error: "No resume PDF uploaded." });
             return;
        }

        const jobDescription = req.body.jobDescription;
        if (!jobDescription) {
             res.status(400).json({ error: "Job description is required." });
             return;
        }

        // 1. Extract text from PDF
        const resumeText = await extractTextFromPDFBuffer(req.file.buffer);

        // 2. Analyze with AI
        const analysis = await analyzeResumeWithAI(resumeText, jobDescription);

        res.status(200).json(analysis);
    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: error.message || "An error occurred during analysis." });
    }
};

export const optimizeSummary = async (req: Request, res: Response): Promise<void> => {
    try {
        const { currentSummary, jobDescription } = req.body;

        if (!currentSummary || !jobDescription) {
             res.status(400).json({ error: "Both currentSummary and jobDescription are required." });
             return;
        }

        const optimizedSummary = await optimizeSummaryWithAI(currentSummary, jobDescription);

        res.status(200).json({ optimizedSummary });
    } catch (error: any) {
        console.error("Optimization Error:", error);
        res.status(500).json({ error: error.message || "An error occurred during summary optimization." });
    }
};

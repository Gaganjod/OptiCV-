import { Request, Response } from 'express';
import { extractTextFromPDFBuffer } from '../services/pdfService';
import { analyzeResumeWithAI, optimizeSummaryWithAI, generateCoverLetterWithAI } from '../services/aiService';
import { HistoryModel } from '../models/History';

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

        const userId = req.body.userId;
        let historyId = null;

        // 1. Extract text from PDF
        const resumeText = await extractTextFromPDFBuffer(req.file.buffer);

        // 2. Analyze with AI
        const analysis = await analyzeResumeWithAI(resumeText, jobDescription);

        // 3. Save History if user is logged in
        if (userId) {
            try {
                const newHistory = new HistoryModel({
                    userId,
                    jobDescription,
                    matchScore: analysis.matchScore,
                    overallFeedback: analysis.overallFeedback,
                    missingKeywords: analysis.missingKeywords,
                    bulletPointSuggestions: analysis.bulletPointSuggestions,
                });
                await newHistory.save();
                historyId = newHistory._id;
            } catch (dbError) {
                console.error("Error saving history:", dbError);
            }
        }

        res.status(200).json({ ...analysis, historyId });
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

export const generateCoverLetter = async (req: Request, res: Response): Promise<void> => {
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

        const resumeText = await extractTextFromPDFBuffer(req.file.buffer);
        const coverLetter = await generateCoverLetterWithAI(resumeText, jobDescription);

        const userId = req.body.userId;
        const historyId = req.body.historyId;

        // Save cover letter to DB if user is logged in
        if (userId && historyId) {
            try {
                await HistoryModel.findByIdAndUpdate(historyId, { coverLetter });
            } catch (dbError) {
                console.error("Error updating history with cover letter:", dbError);
            }
        } else if (userId) {
            try {
                const newHistory = new HistoryModel({
                    userId,
                    jobDescription,
                    matchScore: 0,
                    coverLetter
                });
                await newHistory.save();
            } catch (dbError) {
                console.error("Error creating history for cover letter:", dbError);
            }
        }

        res.status(200).json({ coverLetter });
    } catch (error: any) {
        console.error("Cover Letter Generation Error:", error);
        res.status(500).json({ error: error.message || "An error occurred during cover letter generation." });
    }
};

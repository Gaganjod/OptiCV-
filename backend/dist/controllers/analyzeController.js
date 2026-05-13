"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeSummary = exports.analyzeResume = void 0;
const pdfService_1 = require("../services/pdfService");
const aiService_1 = require("../services/aiService");
const analyzeResume = async (req, res) => {
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
        const resumeText = await (0, pdfService_1.extractTextFromPDFBuffer)(req.file.buffer);
        // 2. Analyze with AI
        const analysis = await (0, aiService_1.analyzeResumeWithAI)(resumeText, jobDescription);
        res.status(200).json(analysis);
    }
    catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: error.message || "An error occurred during analysis." });
    }
};
exports.analyzeResume = analyzeResume;
const optimizeSummary = async (req, res) => {
    try {
        const { currentSummary, jobDescription } = req.body;
        if (!currentSummary || !jobDescription) {
            res.status(400).json({ error: "Both currentSummary and jobDescription are required." });
            return;
        }
        const optimizedSummary = await (0, aiService_1.optimizeSummaryWithAI)(currentSummary, jobDescription);
        res.status(200).json({ optimizedSummary });
    }
    catch (error) {
        console.error("Optimization Error:", error);
        res.status(500).json({ error: error.message || "An error occurred during summary optimization." });
    }
};
exports.optimizeSummary = optimizeSummary;

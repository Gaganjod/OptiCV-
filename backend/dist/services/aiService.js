"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeSummaryWithAI = exports.analyzeResumeWithAI = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../.env' });
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing from environment variables.");
}
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey || "DUMMY_KEY");
const analyzeSchema = {
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        matchScore: {
            type: generative_ai_1.SchemaType.INTEGER,
            description: "A score from 0 to 100 indicating how well the resume matches the job description."
        },
        missingKeywords: {
            type: generative_ai_1.SchemaType.ARRAY,
            items: { type: generative_ai_1.SchemaType.STRING },
            description: "List of important keywords from the job description that are missing in the resume."
        },
        bulletPointSuggestions: {
            type: generative_ai_1.SchemaType.OBJECT,
            description: "A key-value pair of original weak bullet points to suggested improved bullet points."
        },
        overallFeedback: {
            type: generative_ai_1.SchemaType.STRING,
            description: "A short, encouraging paragraph summarizing the resume's strengths and areas for improvement."
        }
    },
    required: ["matchScore", "missingKeywords", "bulletPointSuggestions", "overallFeedback"]
};
const analyzeResumeWithAI = async (resumeText, jobDescription) => {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: analyzeSchema,
        }
    });
    const prompt = `
        You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
        I will provide you with a candidate's resume text and a job description.
        Your task is to analyze the resume against the job description and provide structured JSON feedback.

        Job Description:
        ${jobDescription}

        Resume:
        ${resumeText}
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
};
exports.analyzeResumeWithAI = analyzeResumeWithAI;
const optimizeSummaryWithAI = async (currentSummary, jobDescription) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `
        You are an expert resume writer. 
        Rewrite the following resume summary to better align with the given job description.
        Make it compelling, concise, and professional. Return ONLY the rewritten text, without any markdown formatting or extra text.

        Job Description:
        ${jobDescription}

        Current Summary:
        ${currentSummary}
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
};
exports.optimizeSummaryWithAI = optimizeSummaryWithAI;

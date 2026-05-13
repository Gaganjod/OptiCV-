import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import dotenv from 'dotenv';
import dns from 'node:dns';

// Force IPv4 to prevent Node.js fetch failed errors with Google APIs
dns.setDefaultResultOrder('ipv4first');

dotenv.config({ path: '../.env' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing from environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "DUMMY_KEY");

const analyzeSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        matchScore: {
            type: SchemaType.INTEGER,
            description: "A score from 0 to 100 indicating how well the resume matches the job description."
        },
        missingKeywords: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "List of important keywords from the job description that are missing in the resume."
        },
        bulletPointSuggestions: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    original: { type: SchemaType.STRING },
                    suggested: { type: SchemaType.STRING }
                },
                required: ["original", "suggested"]
            },
            description: "List of weak bullet points and their suggested improvements."
        },
        overallFeedback: {
            type: SchemaType.STRING,
            description: "A short, encouraging paragraph summarizing the resume's strengths and areas for improvement."
        }
    },
    required: ["matchScore", "missingKeywords", "bulletPointSuggestions", "overallFeedback"]
};

export const analyzeResumeWithAI = async (resumeText: string, jobDescription: string) => {
    const model = genAI.getGenerativeModel({
        model: 'gemini-flash-latest',
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

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return JSON.parse(response.text());
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        if (error.cause) {
            console.error("Underlying Fetch Error Cause:", error.cause);
            throw new Error(`Google API Connection Error: ${error.cause.message || error.cause.code || 'Unknown network drop'}`);
        }
        throw error;
    }
};

export const optimizeSummaryWithAI = async (currentSummary: string, jobDescription: string) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

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

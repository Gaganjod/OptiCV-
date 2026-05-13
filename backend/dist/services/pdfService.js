"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromPDFBuffer = void 0;
const pdfParse = require('pdf-parse');
const extractTextFromPDFBuffer = async (buffer) => {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    }
    catch (error) {
        console.error("Error parsing PDF:", error);
        throw new Error("Failed to parse PDF document");
    }
};
exports.extractTextFromPDFBuffer = extractTextFromPDFBuffer;

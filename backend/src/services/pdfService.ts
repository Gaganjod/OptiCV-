const pdfParse = require('pdf-parse');

export const extractTextFromPDFBuffer = async (buffer: Buffer): Promise<string> => {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error("Error parsing PDF:", error);
        throw new Error("Failed to parse PDF document: " + (error as any).message);
    }
};

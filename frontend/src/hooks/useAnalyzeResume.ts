import { useMutation } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/_/backend' : 'http://localhost:5000');

export interface AnalysisResponse {
    matchScore: number;
    missingKeywords: string[];
    bulletPointSuggestions: Array<{ original: string; suggested: string }>;
    overallFeedback: string;
}

export const useAnalyzeResume = () => {
    return useMutation<AnalysisResponse, Error, { file: File; jobDescription: string }>({
        mutationFn: async ({ file, jobDescription }) => {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('jobDescription', jobDescription);

            const response = await fetch(`${API_URL}/api/analyze`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze resume');
            }

            return response.json();
        },
    });
};

export const useOptimizeSummary = () => {
    return useMutation<{ optimizedSummary: string }, Error, { currentSummary: string; jobDescription: string }>({
        mutationFn: async ({ currentSummary, jobDescription }) => {
            const response = await fetch(`${API_URL}/api/optimize-summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentSummary, jobDescription }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to optimize summary');
            }

            return response.json();
        },
    });
};

export const useGenerateCoverLetter = () => {
    return useMutation<{ coverLetter: string }, Error, { file: File; jobDescription: string }>({
        mutationFn: async ({ file, jobDescription }) => {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('jobDescription', jobDescription);

            const response = await fetch(`${API_URL}/api/generate-cover-letter`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate cover letter');
            }

            return response.json();
        },
    });
};

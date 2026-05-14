import { useMutation, useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/_/backend' : 'http://localhost:5000');

export interface AnalysisResponse {
    historyId?: string;
    matchScore: number;
    missingKeywords: string[];
    bulletPointSuggestions: Array<{ original: string; suggested: string }>;
    overallFeedback: string;
}

const analyzeResume = async ({ file, jobDescription, userId }: { file: File; jobDescription: string; userId?: string }): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);
    if (userId) formData.append('userId', userId);

    const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze resume');
    }

    return response.json();
};

export const useAnalyzeResume = () => {
    return useMutation<AnalysisResponse, Error, { file: File; jobDescription: string; userId?: string }>({
        mutationFn: analyzeResume,
    });
};

export const useOptimizeSummary = () => {
    return useMutation<{ optimizedSummary: string }, Error, { currentSummary: string; jobDescription: string; userId?: string; historyId?: string }>({
        mutationFn: async ({ currentSummary, jobDescription, userId, historyId }) => {
            const response = await fetch(`${API_URL}/api/optimize-summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentSummary, jobDescription, userId, historyId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to optimize summary');
            }

            return response.json();
        },
    });
};

const generateCoverLetter = async ({ file, jobDescription, userId, historyId }: { file: File; jobDescription: string; userId?: string; historyId?: string }): Promise<{ coverLetter: string }> => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);
    if (userId) formData.append('userId', userId);
    if (historyId) formData.append('historyId', historyId);

    const response = await fetch(`${API_URL}/api/generate-cover-letter`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate cover letter');
    }

    return response.json();
};

export const useGenerateCoverLetter = () => {
    return useMutation<{ coverLetter: string }, Error, { file: File; jobDescription: string; userId?: string; historyId?: string }>({
        mutationFn: generateCoverLetter,
    });
};

export interface HistoryItem extends AnalysisResponse {
  _id: string;
  userId: string;
  jobDescription: string;
  coverLetter?: string;
  createdAt: string;
}

export const useFetchHistory = (userId?: string | null) => {
  return useQuery<HistoryItem[], Error>({
    queryKey: ['history', userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(`${API_URL}/api/history?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      return response.json();
    },
    enabled: !!userId,
  });
};

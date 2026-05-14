import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // For fast querying by user
  },
  jobDescription: {
    type: String,
    required: true
  },
  matchScore: {
    type: Number,
    required: true
  },
  overallFeedback: {
    type: String,
  },
  missingKeywords: {
    type: [String],
    default: []
  },
  bulletPointSuggestions: {
    type: Array,
    default: []
  },
  coverLetter: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const HistoryModel = mongoose.model('History', HistorySchema);

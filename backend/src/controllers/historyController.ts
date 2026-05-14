import { Request, Response } from 'express';
import { HistoryModel } from '../models/History';

export const getUserHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.query.userId;
        
        if (!userId) {
             res.status(400).json({ error: "userId is required." });
             return;
        }

        const history = await HistoryModel.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error: any) {
        console.error("Fetch History Error:", error);
        res.status(500).json({ error: error.message || "An error occurred fetching history." });
    }
};

export const deleteHistoryItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const userId = req.body.userId;
        
        const deleted = await HistoryModel.findOneAndDelete({ _id: id, userId });
        if (!deleted) {
             res.status(404).json({ error: "History item not found or unauthorized." });
             return;
        }

        res.status(200).json({ message: "History item deleted successfully." });
    } catch (error: any) {
        console.error("Delete History Error:", error);
        res.status(500).json({ error: error.message || "An error occurred deleting history." });
    }
};

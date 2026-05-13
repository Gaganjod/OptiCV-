"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const analyzeController_1 = require("../controllers/analyzeController");
const router = (0, express_1.Router)();
// Configure multer for memory storage (we don't need to save the PDF to disk)
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
router.post('/analyze', upload.single('resume'), analyzeController_1.analyzeResume);
router.post('/optimize-summary', analyzeController_1.optimizeSummary);
exports.default = router;

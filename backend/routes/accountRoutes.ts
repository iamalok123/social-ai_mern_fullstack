import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    addAccount,
    disconnectAccount,
    getAccountHealth,
    getAccounts,
    getInstagramAudioItem,
    getInstagramStoryInsights,
    listInstagramStories,
    searchInstagramAudio
} from "../controllers/accountController.js";

const accountRouter = express.Router();

accountRouter.get('/', protect, getAccounts);
accountRouter.post('/', protect, addAccount);
accountRouter.delete('/:id', protect, disconnectAccount);

// Account Health Diagnostics
accountRouter.get('/:id/health', protect, getAccountHealth);

// Instagram Specific APIs
accountRouter.get('/instagram/audio/search', protect, searchInstagramAudio);
accountRouter.get('/instagram/audio/:audioId', protect, getInstagramAudioItem);
accountRouter.get('/:id/instagram/audio', protect, searchInstagramAudio);
accountRouter.get('/:id/instagram/audio/:audioId', protect, getInstagramAudioItem);
accountRouter.get('/:id/instagram/stories', protect, listInstagramStories);
accountRouter.get('/:id/instagram/stories/:storyId/insights', protect, getInstagramStoryInsights);

export default accountRouter;
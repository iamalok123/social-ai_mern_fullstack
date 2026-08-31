import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { deleteGeneration, deletePost, generatePost, getGenerations, getPosts, schedulePost } from "../controllers/postController.js";
import { upload } from "../config/multer.js";
import { evaluateScheduledPosts } from "../services/schedulerService.js";

const postRouter = express.Router();

postRouter.get('/cron-trigger', async (_req, res) => {
    try {
        const result = await evaluateScheduledPosts();
        res.status(200).json({ status: "ok", result, timestamp: new Date() });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error?.message });
    }
});

postRouter.get('/', protect, getPosts);
postRouter.delete('/:id', protect, deletePost);
postRouter.get('/generations', protect, getGenerations);
postRouter.delete('/generations/:id', protect, deleteGeneration);
postRouter.post('/', protect, upload.single("media"), schedulePost);
postRouter.post('/generate', protect, generatePost);

export default postRouter
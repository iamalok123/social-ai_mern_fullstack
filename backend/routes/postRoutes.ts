import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { deleteGeneration, generatePost, getGenerations, getPosts, schedulePost } from "../controllers/postController.js";
import { upload } from "../config/multer.js";

const postRouter = express.Router();

postRouter.get('/', protect, getPosts);
postRouter.get('/generations', protect, getGenerations);
postRouter.delete('/generations/:id', protect, deleteGeneration);
postRouter.post('/', protect, upload.single("media"), schedulePost);
postRouter.post('/generate', protect, generatePost);

export default postRouter
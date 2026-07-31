import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../config/multer.js";
import {
    getIdeas,
    createIdea,
    updateIdea,
    deleteIdea,
    uploadIdeaImage,
    generateAiIdeas,
} from "../controllers/ideaController.js";

const ideaRouter = express.Router();

ideaRouter.get("/", protect, getIdeas);
ideaRouter.post("/", protect, createIdea);
ideaRouter.put("/:id", protect, updateIdea);
ideaRouter.delete("/:id", protect, deleteIdea);
ideaRouter.post("/upload", protect, upload.single("image"), uploadIdeaImage);
ideaRouter.post("/generate-ai", protect, generateAiIdeas);

export default ideaRouter;

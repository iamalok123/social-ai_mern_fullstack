import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getAllPlatforms, getPlatformById } from "../controllers/platformController.js";
import { validateTwitterPost } from "../services/social/platforms/twitter/twitterController.js";
import { validateLinkedInPost } from "../services/social/platforms/linkedin/linkedinController.js";
import { validateInstagramPost } from "../services/social/platforms/instagram/instagramController.js";
import { validateFacebookPost } from "../services/social/platforms/facebook/facebookController.js";

const platformRouter = express.Router();

// General platform metadata endpoints
platformRouter.get("/", getAllPlatforms);
platformRouter.get("/:platform", getPlatformById);

// Platform-specific validation endpoints
platformRouter.post("/twitter/validate", protect, validateTwitterPost);
platformRouter.post("/linkedin/validate", protect, validateLinkedInPost);
platformRouter.post("/instagram/validate", protect, validateInstagramPost);
platformRouter.post("/facebook/validate", protect, validateFacebookPost);

export default platformRouter;


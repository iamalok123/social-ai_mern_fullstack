import { Router } from "express";
import { changePassword, googleAuth, loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/google', googleAuth);
authRouter.put('/change-password', protect, changePassword);

export default authRouter;
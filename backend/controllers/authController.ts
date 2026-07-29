import { Request, Response } from "express";
import { User } from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/authMiddleware.js";


const generateToken = (id: string) => {
    return jwt.sign({id}, process.env.JWT_SECRET as string, {expiresIn: "30d"});
}


// Register User
// POST /api/auth/register
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "Please provide all required fields." });
            return;
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: "User already exists." });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            authProvider: "email"
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                authProvider: user.authProvider || "email",
                token: generateToken(user._id.toString())
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error: any) {
        res.status(500).json({ message: error?.message || "Internal Server Error" });
    }
}


// Login User
// POST /api/auth/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Please provide email and password." });
            return;
        }

        const user = await User.findOne({ email });

        if (user && user.password && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                authProvider: user.authProvider || "email",
                token: generateToken(user._id.toString())
            });
        } else {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }
    }
    catch (error: any) {
        res.status(500).json({ message: error?.message || "Internal Server Error" });
    }
}


// Google Authentication (Login / Register)
// POST /api/auth/google
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email } = req.body;

        if (!email) {
            res.status(400).json({ message: "Email is required for Google Authentication." });
            return;
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name || email.split("@")[0] || "Google User",
                email,
                authProvider: "google"
            });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            authProvider: user.authProvider || "google",
            token: generateToken(user._id.toString())
        });
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Google Authentication Failed" });
    }
}


// Change Password (for Email/Password accounts)
// PUT /api/auth/change-password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: "Please provide both current and new password." });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ message: "New password must be at least 6 characters." });
            return;
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        if (user.authProvider === "google" || !user.password) {
            res.status(400).json({ message: "Password change is not available for accounts authenticated with Google." });
            return;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Incorrect current password." });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Failed to change password." });
    }
}
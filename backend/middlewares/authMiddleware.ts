import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                res.status(401).json({ message: "Not authorized, user not found" });
                return;
            }
            next();
            return;
        } catch (error: any) {
            const isExpired = error?.name === "TokenExpiredError" || error?.message?.includes("expired");
            const message = isExpired
                ? "Your session has expired. Please log in again."
                : (error?.message || "Not authorized, token failed");
            res.status(401).json({
                message,
                code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN"
            });
            return;
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
        return;
    }
}
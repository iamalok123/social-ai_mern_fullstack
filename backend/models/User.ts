import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    authProvider: {
        type: String,
        enum: ["email", "google"],
        default: "email"
    },
    picture: {
        type: String
    },
    zernioProfileId: {
        type: String
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema)
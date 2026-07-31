import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    columnId: {
        type: String,
        required: true,
        default: "backlog",
    },
    images: [{
        type: String,
    }],
    tags: [{
        type: String,
    }],
}, { timestamps: true });

export const Idea = mongoose.model("Idea", ideaSchema);

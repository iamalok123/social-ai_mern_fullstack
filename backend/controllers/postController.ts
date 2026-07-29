import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { GoogleGenAI } from "@google/genai";
import { cloudinary } from "../config/cloudinary.js";
import { Generation } from "../models/Generation.js";
import { Post } from "../models/Post.js";


// Generate post
// POST /api/posts/generate
export const generatePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { prompt, tone, generateImage } = req.body;

        if (!prompt) {
            res.status(400).json({ message: "Prompt is required." });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            res.status(400).json({ message: "Gemini API Key is missing. Please add it to your server/.env file." });
            return;
        }

        const ai = new GoogleGenAI({ apiKey });

        // Generate Text
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a social media post based on this prompt: "${prompt}".
                Tone: ${tone || "professional"}.
                Include relevant hashtags.
                Format the response as JSON with "content" and "imagePrompt" fields.
                The "imagePrompt" should be a highly descriptive prompt for an image generator that complements the post.`,
        });

        let content = "";
        let imagePrompt = prompt;

        try {
            const rawText = textResponse.text || "";
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { content: rawText, imagePrompt: prompt };
            content = data.content || rawText;
            imagePrompt = data.imagePrompt || prompt;
        } catch (e) {
            content = textResponse.text || "";
        }

        let mediaUrl = "";
        if (generateImage) {
            try {
                // Generate Image using Gemini Imagen 3
                const imageResponse = await ai.models.generateImages({
                    model: 'imagen-3.0-generate-002',
                    prompt: imagePrompt,
                    config: {
                        numberOfImages: 1,
                        outputMimeType: 'image/jpeg',
                    },
                });

                const base64Bytes = imageResponse.generatedImages?.[0]?.image?.imageBytes;

                if (base64Bytes) {
                    // Upload base64 image to Cloudinary for permanent storage
                    const dataUri = `data:image/jpeg;base64,${base64Bytes}`;
                    const uploadResult = await cloudinary.uploader.upload(dataUri, {
                        folder: "ai-generations",
                    });
                    mediaUrl = uploadResult.secure_url;
                }
            } catch (imgError: any) {
                console.error("Gemini Imagen image generation error:", imgError?.message || imgError);
            }
        }

        // Save generation to DB
        const generation = await Generation.create({
            user: req.user._id,
            prompt,
            content,
            mediaUrl: mediaUrl || undefined,
            mediaType: mediaUrl ? "image" : undefined,
            tone
        });

        res.status(201).json(generation);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Server Error" });
    }
}


// Get generations
// GET /api/posts/generations
export const getGenerations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const generations = await Generation.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(generations);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Server error" });
    }
}


// Get posts
// GET /api/posts
export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const posts = await Post.find({ user: req.user._id });
        res.json(posts);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Server error" });
    }
}


// Schedule post
// POST /api/posts
export const schedulePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { content, platforms, scheduledFor, status } = req.body;

        // Parse platforms if it comes as a stringified array from FormData
        let parsedPlatforms = platforms;
        if (typeof platforms === "string") {
            try {
                parsedPlatforms = JSON.parse(platforms);
            } catch (e) {
                parsedPlatforms = platforms.split(",");
            }
        }

        let mediaUrl: string | undefined = req.body.mediaUrl;
        let mediaType: "image" | "video" | undefined = req.body.mediaType;

        if (req.file) {
            const result = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({
                    resource_type: "auto",
                    folder: "social-ai"
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
                stream.end(req.file!.buffer);
            });
            mediaUrl = result.secure_url;
            mediaType = result.resource_type === "video" ? "video" : "image";
        }

        const post = await Post.create({
            user: req.user._id,
            content,
            platforms: parsedPlatforms,
            mediaUrl,
            mediaType,
            scheduledFor,
            status,
        });

        res.status(201).json(post);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Server error" });
    }
}
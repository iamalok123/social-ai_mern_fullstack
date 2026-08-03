import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { GoogleGenAI } from "@google/genai";
import { cloudinary } from "../config/cloudinary.js";
import { Generation } from "../models/Generation.js";
import { Post } from "../models/Post.js";


import { generateAIImage } from "../services/imageGenService.js";

const themeStyleMap: Record<string, string> = {
    professional: "clean, corporate, minimalist studio photography style, high-end visual aesthetic",
    creative: "vibrant artistic style, rich color palette, dynamic composition, creative visual storytelling",
    funny: "bold comic-style illustration, vibrant colors, humorous exaggerated visual style",
    minimalist: "flat design, soft pastel colors, plenty of negative space, elegant minimalist art",
    excited: "energetic bright neon aesthetic, high dynamic action style, vivid electric visual style",
    meme: "bold comic-style illustration, vibrant colors, humorous exaggerated style",
    cyberpunk: "neon-lit futuristic cyberpunk aesthetic, high contrast, glowing digital artwork",
};

/**
 * Constructs a context-aware, structured visual prompt for image generation
 * models based on Gemini's visual scene description, generated post content, and target tone.
 */
function buildSocialMediaImagePrompt(aiVisualScene: string, postContent: string, tone?: string): string {
    const toneKey = (tone || "professional").toLowerCase();
    const styleSuffix = themeStyleMap[toneKey] || themeStyleMap.professional;

    // Extract core subject/theme keywords from postContent (first sentence without hashtags)
    const cleanedContent = postContent.replace(/[\r\n]+/g, " ").replace(/#\w+/g, "").trim();
    const keySentence = cleanedContent.split(/(?<=[.!?])\s+/)[0] || cleanedContent;
    const contextSnippet = keySentence.slice(0, 140);

    // Clean aiVisualScene
    const cleanScene = (aiVisualScene || contextSnippet)
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .replace(/["{}]/g, "")
        .trim();

    // Construct structured prompt optimized for image diffusion models
    return `Social media visual hero illustration: ${cleanScene}. Inspired by post topic: "${contextSnippet}". Style: ${styleSuffix}, 8k resolution, cinematic lighting, perfectly framed 1:1 square composition, vibrant aesthetic, highly detailed, professional social media graphic.`;
}

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

        // Generate Text with multi-model fallback & dynamic fallback generator
        let content = "";
        let imagePrompt = prompt;
        let generatedSuccessfully = false;

        const envModel = process.env.GEMINI_MODEL;
        const defaultModels = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-pro"];
        const modelsToTry = Array.from(new Set(envModel ? [envModel, ...defaultModels] : defaultModels));

        for (const modelName of modelsToTry) {
            try {
                console.log(`📝 [TEXT GEN] Requesting text post via Gemini Model: ${modelName}...`);
                const textResponse = await ai.models.generateContent({
                    model: modelName,
                    contents: `You are an expert AI social media content strategist and visual prompt architect.
Generate an engaging, high-performing social media post based on this request: "${prompt}".

Requirements:
1. "content": Write a comprehensive, detailed, and captivating post between 100 and 200 words. Do NOT write short 1-2 sentence posts. Include a compelling hook, detailed insights or narrative, actionable takeaways, a clear call to action (CTA), and 3-5 trending hashtags. Make it a LONG and detailed post.
2. "imagePrompt": Create a vivid, standalone visual scene description (30-50 words) that explicitly visualizes the core subject matter and narrative of the generated post text. Describe specific subjects, background elements, mood, and lighting so an AI image generator can create a perfectly matching social media graphic.

Tone/Style: ${tone || "Professional"}.

Format your output STRICTLY as a valid JSON object with keys "content" and "imagePrompt". Do not include markdown code fence formatting outside the JSON.`,
                });

                const rawText = textResponse.text || "";
                const jsonMatch = rawText.match(/\{[\s\S]*\}/);
                const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { content: rawText, imagePrompt: prompt };

                if (data.content) {
                    content = data.content;
                    imagePrompt = data.imagePrompt || prompt;
                    generatedSuccessfully = true;
                    console.log(`✅ [TEXT GEN PROVIDER] Generated via Gemini Model (${modelName})`);
                    break;
                }
            } catch (err: any) {
                const errMsg = err?.status || err?.code || err?.message || "Unknown error";
                console.warn(`⚠️ [TEXT GEN] Gemini model ${modelName} attempt failed (${errMsg}), trying next model...`);
            }
        }

        if (!generatedSuccessfully || !content) {
            console.log(`✅ [TEXT GEN PROVIDER] Generated via Dynamic Fallback Engine (Gemini API limits reached)`);
            const formattedTopic = prompt.trim();
            const capitalizedTopic = formattedTopic.charAt(0).toUpperCase() + formattedTopic.slice(1);

            const topicTags = formattedTopic
                .replace(/[^a-zA-Z0-9\s]/g, "")
                .split(/\s+/)
                .filter((w: string) => w.length > 3 && !["with", "from", "that", "this", "your", "their", "about", "using", "masterclass", "guide"].includes(w.toLowerCase()))
                .slice(0, 3)
                .map((w: string) => `#${w.charAt(0).toUpperCase()}${w.slice(1).toLowerCase()}`)
                .join(" ");

            const cleanHashtags = topicTags ? topicTags : "#Tech #Innovation";

            content = `🚀 Comprehensive Guide & Deep Dive: ${capitalizedTopic}\n\nIn today's fast-evolving digital landscape, mastering ${formattedTopic} has become an essential strategy for creators, professionals, and forward-thinking teams. Whether you are building new solutions from scratch or refining your existing workflows, taking a structured approach to this topic drives substantial, measurable impact.\n\nKey Strategic Pillars for Success:\n• Strategic Vision: Align your core goals with actionable steps designed specifically around ${formattedTopic}.\n• Modern Frameworks & Tools: Implement cutting-edge automation and proven industry practices to eliminate operational friction.\n• Continuous Optimization: Measure key metrics, gather feedback, and continuously iterate to sustain long-term growth.\n\nBy taking proactive initiative on ${formattedTopic}, you position yourself for long-term productivity and innovation in your field.\n\n💬 What is your biggest challenge or top tip when working on ${formattedTopic}? We would love to hear your insights in the comments below!\n\n${cleanHashtags} #${tone || "Professional"} #GrowthMindset #Leadership #FutureOfWork`;

            imagePrompt = `A high-impact conceptual visual representing ${formattedTopic} with modern ambient lighting and professional studio composition.`;
        }

        let mediaUrl = "";
        if (generateImage) {
            const finalImagePrompt = buildSocialMediaImagePrompt(imagePrompt, content, tone);
            console.log(`🎨 [CONTEXTUAL IMAGE PROMPT]: "${finalImagePrompt}"`);
            mediaUrl = await generateAIImage(finalImagePrompt);
        }

        // Save generation to DB
        const generation = await Generation.create({
            user: req.user._id,
            prompt,
            content,
            mediaUrl: mediaUrl || undefined,
            mediaType: mediaUrl ? "image" : undefined,
            tone,
            theme: req.body.theme || tone
        });

        res.status(201).json(generation);
    } catch (error: any) {
        console.error("Generate Post Error:", error);
        res.status(500).json({ message: error?.message || "Failed to generate post" });
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

/**
 * Helper to extract Cloudinary public_id from a secure_url
 * e.g. "https://res.cloudinary.com/cloud_name/image/upload/v12345/ai-generations/abc.jpg" => "ai-generations/abc"
 */
function extractCloudinaryPublicId(url: string): string | null {
    if (!url || !url.includes("cloudinary.com")) return null;
    try {
        const parts = url.split("/upload/");
        if (parts.length < 2) return null;
        const pathAfterUpload = parts[1];
        const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
        const lastDotIndex = pathWithoutVersion.lastIndexOf(".");
        return lastDotIndex !== -1 ? pathWithoutVersion.substring(0, lastDotIndex) : pathWithoutVersion;
    } catch {
        return null;
    }
}

// Delete generation
// DELETE /api/posts/generations/:id
export const deleteGeneration = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const generation = await Generation.findOne({ _id: id, user: req.user._id });

        if (!generation) {
            res.status(404).json({ message: "Generation not found" });
            return;
        }

        // Delete associated image from Cloudinary if hosted on Cloudinary
        if (generation.mediaUrl) {
            const publicId = extractCloudinaryPublicId(generation.mediaUrl);
            if (publicId) {
                try {
                    const cloudRes = await cloudinary.uploader.destroy(publicId);
                    console.log(`🗑️ [CLOUDINARY DELETED] Public ID: ${publicId}, Result:`, cloudRes);
                } catch (cloudErr: any) {
                    console.warn(`⚠️ [CLOUDINARY DELETE ERROR] Failed to delete ${publicId}:`, cloudErr?.message || cloudErr);
                }
            }
        }

        await Generation.deleteOne({ _id: id });
        console.log(`🗑️ [GENERATION DELETED] Generation ID: ${id}`);
        res.json({ message: "Generation deleted successfully", id });
    } catch (error: any) {
        console.error("Delete Generation Error:", error);
        res.status(500).json({ message: error?.message || "Failed to delete generation" });
    }
};


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

        if (!content) {
            res.status(400).json({ message: "Post content is required." });
            return;
        }
        if (!platforms || platforms.length === 0) {
            res.status(400).json({ message: "At least one platform must be selected." });
            return;
        }
        if (!scheduledFor) {
            res.status(400).json({ message: "Scheduled date and time are required." });
            return;
        }

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
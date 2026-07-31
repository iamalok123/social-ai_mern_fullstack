import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { GoogleGenAI } from "@google/genai";
import { cloudinary } from "../config/cloudinary.js";
import { Idea } from "../models/Idea.js";

// Generate 4 AI content ideas using Gemini
// POST /api/ideas/generate-ai
export const generateAiIdeas = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { businessType, targetAudience, topic } = req.body;

        if (!businessType && !targetAudience && !topic) {
            res.status(400).json({ message: "Please provide business details or target audience." });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const biz = businessType?.trim() || "General Business";
        const aud = targetAudience?.trim() || "Target Audience";
        const top = topic?.trim() || "Growth & Engagement";

        if (!apiKey) {
            const fallbackIdeas = [
                {
                    title: `How ${biz} Solves Top Pain Points`,
                    description: `An engaging educational carousel addressing common struggles for ${aud} with 3 actionable, step-by-step solutions.`,
                    tags: ["Carousel", "Educational", "AI Generated"],
                },
                {
                    title: `3 Costly Mistakes ${aud} Make Every Day`,
                    description: `High-hook video reel script exposing industry myths in ${biz} and introducing your workflow as the ultimate cure.`,
                    tags: ["Reel Script", "Hook", "AI Generated"],
                },
                {
                    title: `Behind-the-Scenes: A Day in the Life with ${biz}`,
                    description: `Authentic storytelling post demonstrating value, values, and genuine human connection tailored for ${aud}.`,
                    tags: ["Storytelling", "Brand", "AI Generated"],
                },
                {
                    title: `The Ultimate ${biz} Roadmap for ${aud}`,
                    description: `A comprehensive cheat sheet and step-by-step guide outlining how ${aud} can achieve fast results with ${biz}.`,
                    tags: ["Guide", "Value Post", "AI Generated"],
                },
            ];
            res.status(200).json({ ideas: fallbackIdeas });
            return;
        }

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are a world-class social media content strategist.
Generate exactly 4 unique, creative, high-converting social media content ideas for the business details below.

Business/Niche: ${biz}
Target Audience: ${aud}
Topic/Focus: ${top}

Return ONLY a valid JSON array of 4 objects with this exact structure:
[
  {
    "title": "Catchy title string",
    "description": "2-3 sentences explaining the hook, post format, and content outline.",
    "tags": ["Tag1", "Tag2"]
  }
]
Do not output markdown codeblocks or text outside the JSON array.`;

        const modelsToTry = [
            process.env.GEMINI_MODEL || "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
        ];

        let generatedIdeas: any[] = [];
        let success = false;

        for (const modelName of modelsToTry) {
            try {
                console.log(`🤖 [IDEAS AI] Requesting content ideas via Gemini Model: ${modelName}...`);
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: prompt,
                });
                const responseText = response.text ? response.text.trim() : "";
                
                const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
                const parsed = JSON.parse(cleanedText);

                if (Array.isArray(parsed) && parsed.length > 0) {
                    generatedIdeas = parsed.slice(0, 4).map((item) => ({
                        title: item.title || `Content Idea for ${biz}`,
                        description: item.description || `Engaging post for ${aud}`,
                        tags: Array.isArray(item.tags) ? item.tags : ["AI Generated"],
                    }));
                    success = true;
                    break;
                }
            } catch (err: any) {
                console.warn(`Model ${modelName} failed or produced non-JSON output, trying next model...`, err?.message);
            }
        }

        if (!success || generatedIdeas.length === 0) {
            generatedIdeas = [
                {
                    title: `How ${biz} Solves Top Pain Points`,
                    description: `An engaging educational carousel addressing common struggles for ${aud} with 3 actionable solutions.`,
                    tags: ["Carousel", "Educational", "AI Generated"],
                },
                {
                    title: `3 Costly Mistakes ${aud} Make Every Day`,
                    description: `High-hook video reel script exposing industry myths in ${biz} and introducing your workflow as the ultimate cure.`,
                    tags: ["Reel Script", "Hook", "AI Generated"],
                },
                {
                    title: `Behind-the-Scenes: A Day in the Life with ${biz}`,
                    description: `Authentic storytelling post demonstrating value, values, and genuine human connection for ${aud}.`,
                    tags: ["Storytelling", "Brand", "AI Generated"],
                },
                {
                    title: `The Ultimate ${biz} Masterclass for ${aud}`,
                    description: `A comprehensive guide outlining how ${aud} can maximize efficiency and results using ${biz}.`,
                    tags: ["Guide", "Growth", "AI Generated"],
                },
            ];
        }

        res.status(200).json({ ideas: generatedIdeas });
    } catch (error: any) {
        console.error("AI Idea Generation Error:", error);
        res.status(500).json({ message: error?.message || "Failed to generate AI ideas." });
    }
};

// Upload image for content idea to Cloudinary
// POST /api/ideas/upload
export const uploadIdeaImage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No image file provided." });
            return;
        }

        const result = await new Promise<any>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                resource_type: "auto",
                folder: "social-ai/ideas",
            }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
            stream.end(req.file!.buffer);
        });

        res.status(200).json({ url: result.secure_url });
    } catch (error: any) {
        console.error("Cloudinary Image Upload Error:", error);
        res.status(500).json({ message: error?.message || "Failed to upload image to Cloudinary" });
    }
};

// Get all ideas for authenticated user
// GET /api/ideas
export const getIdeas = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ideas = await Idea.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(ideas);
    } catch (error: any) {
        console.error("Get Ideas Error:", error);
        res.status(500).json({ message: error?.message || "Server error fetching ideas" });
    }
};

// Create a new content idea
// POST /api/ideas
export const createIdea = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, columnId, images, tags } = req.body;

        if (!title || !title.trim()) {
            res.status(400).json({ message: "Idea title is required." });
            return;
        }

        const idea = await Idea.create({
            user: req.user._id,
            title: title.trim(),
            description: description ? description.trim() : "",
            columnId: columnId || "backlog",
            images: Array.isArray(images) ? images : [],
            tags: Array.isArray(tags) ? tags : [],
        });

        res.status(201).json(idea);
    } catch (error: any) {
        console.error("Create Idea Error:", error);
        res.status(500).json({ message: error?.message || "Failed to create content idea" });
    }
};

// Update an existing content idea
// PUT /api/ideas/:id
export const updateIdea = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, columnId, images, tags } = req.body;

        const idea = await Idea.findOne({ _id: id, user: req.user._id });

        if (!idea) {
            res.status(404).json({ message: "Content idea not found." });
            return;
        }

        if (title !== undefined) idea.title = title.trim();
        if (description !== undefined) idea.description = description.trim();
        if (columnId !== undefined) idea.columnId = columnId;
        if (images !== undefined) idea.images = Array.isArray(images) ? images : [];
        if (tags !== undefined) idea.tags = Array.isArray(tags) ? tags : [];

        await idea.save();

        res.status(200).json(idea);
    } catch (error: any) {
        console.error("Update Idea Error:", error);
        res.status(500).json({ message: error?.message || "Failed to update content idea" });
    }
};

// Delete a content idea
// DELETE /api/ideas/:id
export const deleteIdea = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const idea = await Idea.findOneAndDelete({ _id: id, user: req.user._id });

        if (!idea) {
            res.status(404).json({ message: "Content idea not found." });
            return;
        }

        res.status(200).json({ message: "Content idea deleted successfully.", id });
    } catch (error: any) {
        console.error("Delete Idea Error:", error);
        res.status(500).json({ message: error?.message || "Failed to delete content idea" });
    }
};

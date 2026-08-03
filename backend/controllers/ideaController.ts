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

        const envModel = process.env.GEMINI_MODEL;
        const defaultModels = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-pro"];
        const modelsToTry = Array.from(new Set(envModel ? [envModel, ...defaultModels] : defaultModels));

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
                const errMsg = err?.status || err?.code || err?.message || "Unknown error";
                console.warn(`⚠️ [IDEAS AI] Model ${modelName} failed (${errMsg}), trying next model...`);
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

// Helper function for local AI Assistant fallback when Gemini API limit is hit or unavailable
const fallbackAiTransform = (content: string, action: string): string => {
    const trimmed = content.trim();
    if (action === "grammar") {
        let corrected = trimmed
            .replace(/\s+/g, " ")
            .replace(/\b(dont)\b/gi, "don't")
            .replace(/\b(cant)\b/gi, "can't")
            .replace(/\b(wont)\b/gi, "won't")
            .replace(/\b(im)\b/gi, "I'm")
            .replace(/\b(ive)\b/gi, "I've")
            .replace(/\b(youre)\b/gi, "you're")
            .replace(/\b(theyre)\b/gi, "they're")
            .replace(/\b(its)\b(?=\s+a|\s+the|\s+an|\s+going|\s+very|\s+important|\s+ready|\s+not)/gi, "it's");

        if (corrected.length > 0) {
            corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
        }
        if (!/[.!?]$/.test(corrected)) {
            corrected += ".";
        }
        return corrected;
    } else if (action === "longer") {
        const firstSentence = trimmed.split(/(?<=[.!?])\s+/)[0] || trimmed;
        return `${trimmed}\n\nStrategic Deep Dive & Execution Framework:\n• Key Pillar: ${firstSentence}\n• Tactical Advice: Implement structured daily workflows, utilize data analytics to track audience retention, and optimize hooks.\n• Value Proposition: Consistent value delivery builds compounding brand equity over time.\n\n💬 What is your top strategy for executing this idea? Let's discuss below! #ContentStrategy #Growth`;
    } else if (action === "shorter") {
        const sentences = trimmed.split(/(?<=[.!?])\s+/);
        const coreSentence = sentences[0] || trimmed;
        return `${coreSentence}\n\n💡 Core Takeaway: Focus on high-impact value & consistent execution! #SocialMedia #Growth`;
    }
    return trimmed;
};

// Enhance content idea with AI Assistant
// POST /api/ideas/ai-assistant
export const aiAssistantIdea = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { content, action } = req.body;

        if (!content || !action) {
            res.status(400).json({ message: "Content and action are required." });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.log(`✅ [MODIFY AI PROVIDER] Modified content via Local Fallback Engine (No API Key configured)`);
            const modifiedContent = fallbackAiTransform(content, action);
            res.status(200).json({ modifiedContent });
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        let prompt = "";

        if (action === "grammar") {
            prompt = `Correct the grammar and spelling of the following text. Do not change the meaning or tone. Only output the corrected text. Do not include markdown codeblocks or quotes around the text:\n\n${content}`;
        } else if (action === "longer") {
            prompt = `Expand on the following text to make it longer and more detailed. Add relevant details and context while maintaining the original meaning. Only output the expanded text. Do not include markdown codeblocks or quotes around the text:\n\n${content}`;
        } else if (action === "shorter") {
            prompt = `Summarize the following text to make it shorter and more concise. Keep the core message intact. Only output the shortened text. Do not include markdown codeblocks or quotes around the text:\n\n${content}`;
        } else {
            res.status(400).json({ message: "Invalid action." });
            return;
        }

        const envModel = process.env.GEMINI_MODEL;
        const defaultModels = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-pro"];
        const modelsToTry = Array.from(new Set(envModel ? [envModel, ...defaultModels] : defaultModels));

        let modifiedContent = "";
        let success = false;

        for (const modelName of modelsToTry) {
            try {
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: prompt,
                });
                
                if (response.text) {
                    modifiedContent = response.text.trim();
                    success = true;
                    break;
                }
            } catch (err: any) {
                const errMsg = err?.status || err?.code || err?.message || "Unknown error";
                console.warn(`⚠️ [MODIFY AI] Model ${modelName} failed (${errMsg}), trying next model...`);
            }
        }

        if (!success || !modifiedContent) {
            console.log(`✅ [MODIFY AI PROVIDER] Modified content via Local Fallback Engine (action: ${action}, Gemini API limits hit)`);
            modifiedContent = fallbackAiTransform(content, action);
        }

        res.status(200).json({ modifiedContent });
    } catch (error: any) {
        console.error("AI Assistant Error:", error);
        res.status(500).json({ message: error?.message || "Failed to process content with AI." });
    }
};

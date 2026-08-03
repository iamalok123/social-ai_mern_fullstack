import { cloudinary } from "../config/cloudinary.js";

/**
 * Safely cleans and truncates image prompts to avoid model length limits
 */
function sanitizePrompt(prompt: string, maxLength: number = 450): string {
    const cleaned = prompt.replace(/[\r\n]+/g, " ").trim();
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

/**
 * Generates a unique AI image with a 2-tier fallback chain:
 * 1. Cloudflare Workers AI (primary: configurable via CLOUDFLARE_IMAGE_MODEL & CLOUDFLARE_IMAGE_STEPS)
 * 2. Pollinations.ai (fallback: unlimited free, uploaded to Cloudinary or raw URL as last resort)
 * Returns a Cloudinary-hosted URL.
 */
export async function generateAIImage(imagePrompt: string): Promise<string> {
    const seed = Math.floor(Math.random() * 10000000);
    const safePrompt = sanitizePrompt(imagePrompt);
    const steps = parseInt(process.env.CLOUDFLARE_IMAGE_STEPS || "20", 10);

    // --- Tier 1: Cloudflare Workers AI ---
    try {
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const apiToken = process.env.CLOUDFLARE_API_TOKEN;
        const model = process.env.CLOUDFLARE_IMAGE_MODEL || "@cf/leonardo/lucid-origin";

        if (accountId && apiToken) {
            console.log(`🎨 [IMAGE GEN] Requesting image via Cloudflare Workers AI (${model}, ${steps} steps)...`);
            const cfResponse = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt: safePrompt, steps, seed }),
                }
            );

            if (cfResponse.ok) {
                const cfData = await cfResponse.json();
                if (cfData?.result?.image) {
                    const dataUri = `data:image/jpeg;base64,${cfData.result.image}`;
                    const uploadResult = await cloudinary.uploader.upload(dataUri, { folder: "ai-generations" });
                    console.log(`✅ [IMAGE GEN PROVIDER] Generated via Cloudflare Workers AI (${model}) -> Cloudinary URL: ${uploadResult.secure_url}`);
                    return uploadResult.secure_url;
                }
            } else {
                console.warn("⚠️ [IMAGE GEN] Cloudflare Workers AI API error:", await cfResponse.text());
            }
        } else {
            console.warn("⚠️ [IMAGE GEN] Cloudflare environment variables missing, moving to Pollinations fallback provider.");
        }
    } catch (err: any) {
        console.warn("⚠️ [IMAGE GEN] Cloudflare Workers AI failed, trying Pollinations fallback:", err?.message || err);
    }

    // --- Tier 2: Pollinations.ai (Fallback provider with random seed) ---
    try {
        console.log(`🎨 [IMAGE GEN] Fallback: Requesting image via Pollinations.ai...`);
        const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(safePrompt)}?width=1080&height=1080&seed=${seed}&nologo=true`;
        const uploadResult = await cloudinary.uploader.upload(aiImageUrl, { folder: "ai-generations" });
        console.log(`✅ [IMAGE GEN PROVIDER] Generated via Pollinations.ai (Cloudinary Uploaded) -> URL: ${uploadResult.secure_url}`);
        return uploadResult.secure_url;
    } catch (err: any) {
        console.error("❌ [IMAGE GEN] Pollinations Cloudinary upload failed:", err?.message || err);
        const directUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(safePrompt)}?width=1080&height=1080&seed=${seed}&nologo=true`;
        console.log(`✅ [IMAGE GEN PROVIDER] Generated via Pollinations.ai (Direct URL Fallback) -> URL: ${directUrl}`);
        return directUrl;
    }
}
import { cloudinary } from "../config/cloudinary.js";

/**
 * Generates a unique AI image with a 2-tier fallback chain:
 * 1. Cloudflare Workers AI - flux-1-schnell (primary: fast, high quality, ~230 free images/day)
 * 2. Pollinations.ai (fallback: unlimited free, uploaded to Cloudinary or raw URL as last resort)
 * Returns a Cloudinary-hosted URL.
 */
export async function generateAIImage(imagePrompt: string): Promise<string> {
    const seed = Math.floor(Math.random() * 10000000);

    // --- Tier 1: Cloudflare Workers AI (flux-1-schnell) ---
    try {
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const apiToken = process.env.CLOUDFLARE_API_TOKEN;

        if (accountId && apiToken) {
            console.log(`🎨 [IMAGE GEN] Requesting image via Cloudflare Workers AI (@cf/black-forest-labs/flux-1-schnell)...`);
            const cfResponse = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt: imagePrompt, steps: 4, seed }),
                }
            );

            if (cfResponse.ok) {
                const cfData = await cfResponse.json();
                if (cfData?.result?.image) {
                    const dataUri = `data:image/jpeg;base64,${cfData.result.image}`;
                    const uploadResult = await cloudinary.uploader.upload(dataUri, { folder: "ai-generations" });
                    console.log(`✅ [IMAGE GEN PROVIDER] Generated via Cloudflare Workers AI (flux-1-schnell) -> Cloudinary URL: ${uploadResult.secure_url}`);
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
        const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1080&height=1080&seed=${seed}&nologo=true`;
        const uploadResult = await cloudinary.uploader.upload(aiImageUrl, { folder: "ai-generations" });
        console.log(`✅ [IMAGE GEN PROVIDER] Generated via Pollinations.ai (Cloudinary Uploaded) -> URL: ${uploadResult.secure_url}`);
        return uploadResult.secure_url;
    } catch (err: any) {
        console.error("❌ [IMAGE GEN] Pollinations Cloudinary upload failed:", err?.message || err);
        const directUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1080&height=1080&seed=${seed}&nologo=true`;
        console.log(`✅ [IMAGE GEN PROVIDER] Generated via Pollinations.ai (Direct URL Fallback) -> URL: ${directUrl}`);
        return directUrl;
    }
}
/**
 * Checks if a JWT token is expired, malformed, or nearing expiration.
 * Decodes the base64 payload safely without external dependencies.
 * Includes a 10-second safety grace window.
 */
export function isTokenExpired(token: string | null | undefined): boolean {
    if (!token || typeof token !== "string") return true;
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return true;
        const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const decodedJson = atob(payloadBase64);
        const payload = JSON.parse(decodedJson);
        if (!payload.exp) return false;
        // 10s buffer to prevent edge-case race conditions
        return Date.now() >= payload.exp * 1000 - 10000;
    } catch {
        return true;
    }
}

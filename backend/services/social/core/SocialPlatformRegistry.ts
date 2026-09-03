import { PlatformAdapter, PlatformCapabilities } from "./types.js";

// Functional registry state
const adapters = new Map<string, PlatformAdapter>();
const aliases = new Map<string, string>([
    ["facebook_page", "facebook"],
    ["linkedin_page", "linkedin"],
    ["instagram_business", "instagram"],
    ["x", "twitter"]
]);

/**
 * Register a platform adapter
 */
export function registerPlatformAdapter(adapter: PlatformAdapter): void {
    adapters.set(adapter.platformId.toLowerCase(), adapter);
    console.log(`🔌 [PLATFORM REGISTRY] Registered platform adapter: ${adapter.displayName} (${adapter.platformId})`);
}

/**
 * Register an alias pointing to an existing platform adapter
 */
export function registerPlatformAlias(alias: string, targetPlatformId: string): void {
    aliases.set(alias.toLowerCase(), targetPlatformId.toLowerCase());
}

/**
 * Retrieve a platform adapter by platformId or alias
 */
export function getPlatformAdapter(platformId: string): PlatformAdapter | undefined {
    const normalized = platformId.toLowerCase();
    const targetId = aliases.get(normalized) || normalized;
    return adapters.get(targetId);
}

/**
 * Check if a platform adapter is registered
 */
export function hasPlatformAdapter(platformId: string): boolean {
    const normalized = platformId.toLowerCase();
    const targetId = aliases.get(normalized) || normalized;
    return adapters.has(targetId);
}

/**
 * Return all registered platform adapters
 */
export function getAllPlatformAdapters(): PlatformAdapter[] {
    return Array.from(adapters.values());
}

/**
 * Return all registered platform capabilities
 */
export function getAllPlatformCapabilities(): PlatformCapabilities[] {
    return getAllPlatformAdapters().map((adapter) => adapter.getCapabilities());
}

/**
 * Backward-compatible object namespace preserving existing caller interface
 */
export const SocialPlatformRegistry = {
    register: registerPlatformAdapter,
    registerAlias: registerPlatformAlias,
    get: getPlatformAdapter,
    has: hasPlatformAdapter,
    getAll: getAllPlatformAdapters,
    getAllCapabilities: getAllPlatformCapabilities
};

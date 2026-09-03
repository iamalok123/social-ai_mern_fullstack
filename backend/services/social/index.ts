import {
    SocialPlatformRegistry,
    registerPlatformAdapter,
    getPlatformAdapter,
    getAllPlatformAdapters,
    getAllPlatformCapabilities
} from "./core/SocialPlatformRegistry.js";
import { twitterAdapter } from "./platforms/twitter/twitterService.js";
import { linkedinAdapter } from "./platforms/linkedin/linkedinService.js";
import { instagramAdapter } from "./platforms/instagram/instagramService.js";
import { facebookAdapter } from "./platforms/facebook/facebookService.js";

// Auto-register all 4 core platform adapters
registerPlatformAdapter(twitterAdapter);
registerPlatformAdapter(linkedinAdapter);
registerPlatformAdapter(instagramAdapter);
registerPlatformAdapter(facebookAdapter);

// Export core functional registry and publisher
export {
    SocialPlatformRegistry,
    registerPlatformAdapter,
    getPlatformAdapter,
    getAllPlatformAdapters,
    getAllPlatformCapabilities
};
export { socialPublishingService, publishPost } from "./publishing/socialPublishingService.js";
export * from "./core/types.js";
export * from "./core/adapterHelpers.js";

// Export platform adapters & controllers
export * from "./platforms/twitter/twitterService.js";
export * from "./platforms/twitter/twitterController.js";
export * from "./platforms/linkedin/linkedinService.js";
export * from "./platforms/linkedin/linkedinController.js";
export * from "./platforms/instagram/instagramService.js";
export * from "./platforms/instagram/instagramController.js";
export * from "./platforms/facebook/facebookService.js";
export * from "./platforms/facebook/facebookController.js";

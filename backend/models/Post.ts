import mongoose from "mongoose";

// ---------------------------------------------------------
// Subdocument Schema: Twitter / X Details
// ---------------------------------------------------------
const twitterDetailsSchema = new mongoose.Schema(
    {
        customContent: { type: String },
        replySettings: {
            type: String,
            enum: ["following", "mentionedUsers", "subscribers", "verified"]
        },
        quoteTweetId: { type: String },
        replyToTweetId: { type: String },
        poll: {
            options: [{ type: String }],
            durationMinutes: { type: Number }
        },
        threadItems: [
            {
                content: { type: String },
                mediaUrls: [{ type: String }]
            }
        ],
        status: {
            type: String,
            enum: ["pending", "published", "failed"],
            default: "pending"
        },
        publishedPostId: { type: String },
        failedReason: { type: String },
        publishedAt: { type: Date }
    },
    { _id: false }
);

// ---------------------------------------------------------
// Subdocument Schema: LinkedIn Details
// ---------------------------------------------------------
const linkedinDetailsSchema = new mongoose.Schema(
    {
        customContent: { type: String },
        firstComment: { type: String },
        disableLinkPreview: { type: Boolean, default: false },
        documentTitle: { type: String },
        organizationUrn: { type: String },
        reshareUrl: { type: String },
        status: {
            type: String,
            enum: ["pending", "published", "failed"],
            default: "pending"
        },
        publishedPostId: { type: String },
        failedReason: { type: String },
        publishedAt: { type: Date }
    },
    { _id: false }
);

// ---------------------------------------------------------
// Subdocument Schema: Instagram Details
// ---------------------------------------------------------
const instagramDetailsSchema = new mongoose.Schema(
    {
        customContent: { type: String },
        contentType: {
            type: String,
            enum: ["feed", "reel", "story"],
            default: "feed"
        },
        shareToFeed: { type: Boolean, default: true },
        collaborators: [{ type: String }],
        firstComment: { type: String },
        userTags: [
            {
                username: { type: String, required: true },
                x: { type: Number },
                y: { type: Number },
                mediaIndex: { type: Number, default: 0 }
            }
        ],
        reelCover: { type: String },
        instagramThumbnail: { type: String },
        thumbOffset: { type: Number, default: 0 },
        audioName: { type: String },
        audioConfiguration: {
            audioId: { type: String },
            audioVolume: { type: Number, min: 0, max: 100, default: 100 },
            videoVolume: { type: Number, min: 0, max: 100, default: 100 }
        },
        muteAudio: { type: Boolean, default: false },
        isAiGenerated: { type: Boolean, default: false },
        isPaidPartnership: { type: Boolean, default: false },
        brandedContentSponsors: [{ type: String }],
        commentsEnabled: { type: Boolean, default: true },
        locationId: { type: String },
        trialParams: {
            graduationStrategy: {
                type: String,
                enum: ["MANUAL", "SS_PERFORMANCE"]
            }
        },
        status: {
            type: String,
            enum: ["pending", "publishing", "published", "failed"],
            default: "pending"
        },
        publishedPostId: { type: String },
        failedReason: { type: String },
        publishedAt: { type: Date }
    },
    { _id: false }
);

// ---------------------------------------------------------
// Subdocument Schema: Facebook Details
// ---------------------------------------------------------
const facebookDetailsSchema = new mongoose.Schema(
    {
        customContent: { type: String },
        contentType: {
            type: String,
            enum: ["feed", "story", "reel"],
            default: "feed"
        },
        title: { type: String },
        firstComment: { type: String },
        pageId: { type: String },
        carouselCards: [
            {
                link: { type: String, required: true },
                name: { type: String },
                description: { type: String }
            }
        ],
        carouselLink: { type: String },
        draft: { type: Boolean, default: false },
        textFormatPresetId: { type: String },
        geoRestriction: {
            countries: [{ type: String }]
        },
        status: {
            type: String,
            enum: ["pending", "published", "failed"],
            default: "pending"
        },
        publishedPostId: { type: String },
        failedReason: { type: String },
        publishedAt: { type: Date }
    },
    { _id: false }
);

// ---------------------------------------------------------
// Main Post Schema
// ---------------------------------------------------------
const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true
        },
        mediaUrl: {
            type: String
        },
        mediaType: {
            type: String,
            enum: ["image", "video"]
        },
        mediaUrls: [
            {
                type: String
            }
        ],
        mediaItems: [
            {
                url: { type: String, required: true },
                type: { type: String, enum: ["image", "video"], default: "image" },
                title: { type: String },
                altText: { type: String },
                thumbnail: { type: String }
            }
        ],
        platforms: [
            {
                type: String,
                enum: [
                    "twitter",
                    "linkedin",
                    "facebook",
                    "instagram",
                    "facebook_page",
                    "linkedin_page",
                    "instagram_business"
                ]
            }
        ],
        scheduledFor: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["draft", "scheduled", "publishing", "published", "failed", "partially_published"],
            default: "scheduled"
        },
        failedReason: {
            type: String
        },
        firstComment: {
            type: String,
            trim: true
        },
        disableLinkPreview: {
            type: Boolean,
            default: false
        },
        platformSpecificData: {
            type: mongoose.Schema.Types.Mixed,
            default: () => ({})
        },
        platformDetails: {
            twitter: { type: twitterDetailsSchema, default: () => ({}) },
            linkedin: { type: linkedinDetailsSchema, default: () => ({}) },
            instagram: { type: instagramDetailsSchema, default: () => ({}) },
            facebook: { type: facebookDetailsSchema, default: () => ({}) }
        }
    },
    { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
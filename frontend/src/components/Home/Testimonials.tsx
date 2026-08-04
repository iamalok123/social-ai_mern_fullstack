import { Star, Heart } from "lucide-react";

// Platform Icon Components
function InstagramIcon({ className = "size-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function FacebookIcon({ className = "size-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function TikTokIcon({ className = "size-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.74V16a7 7 0 1 1-7-7c.34 0 .67.03 1 .08V12z" />
        </svg>
    );
}

function LinkedInIcon({ className = "size-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.64a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
        </svg>
    );
}

function TwitterXIcon({ className = "size-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

interface Testimonial {
    name: string;
    handle: string;
    role: string;
    avatar: string;
    text: string;
    metric: string;
    platform: "instagram" | "twitter" | "linkedin" | "tiktok" | "facebook";
}

const row1Testimonials: Testimonial[] = [
    {
        name: "Sarah Jenkins",
        handle: "@sarah_digital",
        role: "Head of Content @ GrowthPulse",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        text: "Social AI saved our content team 15+ hours every week. The multi-platform scheduling and AI caption generator feel like magic!",
        metric: "+180% Engagement",
        platform: "instagram"
    },
    {
        name: "Marcus Chen",
        handle: "@marcus_dev",
        role: "Indie Creator & Educator",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        text: "I queue up a whole month of post ideas in under 30 minutes. The smart analytics insights are worth 10x the price.",
        metric: "3.2M Impressions",
        platform: "twitter"
    },
    {
        name: "Elena Rostova",
        handle: "@elena_brand",
        role: "Social Media Lead @ TechFlow",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        text: "The team workspace and approval flow made client collaboration completely effortless. Best social media manager out there.",
        metric: "10x Faster Workflow",
        platform: "linkedin"
    },
    {
        name: "Alex Rivera",
        handle: "@alexrivera_design",
        role: "Brand Designer & Influencer",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        text: "Auto-generating viral hooks and matching hashtag strategies boosted our reach by 300% in just two months.",
        metric: "+45K Followers",
        platform: "tiktok"
    }
];

const row2Testimonials: Testimonial[] = [
    {
        name: "David Miller",
        handle: "@davidm_agency",
        role: "Agency Founder @ NexusMedia",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
        text: "Managing 24 client brands simultaneously used to be total chaos. Social AI brought sanity and speed back to our team.",
        metric: "24 Client Accounts",
        platform: "facebook"
    },
    {
        name: "Jessica Vance",
        handle: "@jessvance_co",
        role: "E-commerce Specialist",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
        text: "The analytics dashboard gives us exact peak-time posting windows. Our audience click-through rate jumped overnight.",
        metric: "+$12K Sales Revenue",
        platform: "instagram"
    },
    {
        name: "Liam O'Connor",
        handle: "@liam_strategy",
        role: "SaaS Growth Marketer",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
        text: "The UI is clean, lightning fast, and intuitive. It's rare to find a software tool that just works seamlessly without friction.",
        metric: "Saved 20 hrs/mo",
        platform: "linkedin"
    },
    {
        name: "Sophia Martinez",
        handle: "@sophiacreates",
        role: "YouTube & Reels Creator",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
        text: "I love how easily I can repurpose one video idea across 5 platforms with customized AI captions in one single click!",
        metric: "1.5M Video Views",
        platform: "instagram"
    }
];

function renderPlatformIcon(platform: Testimonial["platform"]) {
    switch (platform) {
        case "instagram":
            return <InstagramIcon className="size-4 text-rose-500" />;
        case "twitter":
            return <TwitterXIcon className="size-3.5 text-slate-800 dark:text-zinc-200" />;
        case "linkedin":
            return <LinkedInIcon className="size-4 text-blue-600" />;
        case "tiktok":
            return <TikTokIcon className="size-4 text-slate-900 dark:text-white" />;
        case "facebook":
            return <FacebookIcon className="size-4 text-blue-500" />;
    }
}

function TestimonialCard({ item }: { item: Testimonial }) {
    return (
        <div className="w-82.5 sm:w-95 shrink-0 bg-slate-50/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-orange-500/40 hover:-translate-y-1 transition-all duration-300 group/card">
            <div>
                {/* Header Row: Rating Stars & Metric Pill */}
                <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                        ))}
                    </div>

                    <div className="bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-semibold px-2.5 py-0.5 rounded-full tracking-tight">
                        {item.metric}
                    </div>
                </div>

                {/* Quote Text */}
                <p className="text-slate-700 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed font-normal">
                    &quot;{item.text}&quot;
                </p>
            </div>

            {/* User Profile Info Footer */}
            <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-200/60 dark:border-zinc-800/60">
                <div className="flex items-center gap-3 overflow-hidden">
                    <img
                        src={item.avatar}
                        alt={item.name}
                        className="size-10 sm:size-11 rounded-full ring-2 ring-orange-500/20 object-cover shrink-0"
                    />
                    <div className="truncate">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate">
                            {item.role}
                        </p>
                    </div>
                </div>

                {/* Platform Badge Icon */}
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 shadow-2xs shrink-0 ml-2">
                    {renderPlatformIcon(item.platform)}
                </div>
            </div>
        </div>
    );
}

export default function Testimonials() {
    // Duplicate lists for seamless 100% infinite marquee loop
    const row1 = [...row1Testimonials, ...row1Testimonials, ...row1Testimonials];
    const row2 = [...row2Testimonials, ...row2Testimonials, ...row2Testimonials];

    return (
        <section id="testimonials" className="py-20 sm:py-28 bg-white dark:bg-black transition-colors duration-200 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-14 text-center">
                {/* Wall of Love Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-medium mb-5">
                    <Heart className="size-3.5 fill-orange-500 text-orange-500" />
                    <span>Wall of Love</span>
                </div>

                {/* Main Heading */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight text-slate-900 dark:text-white leading-tight">
                    What people say about us !
                </h2>

                {/* Subtitle */}
                <p className="mt-4 text-slate-500 dark:text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                    See how Social AI helps creators, marketers, and growth teams automate their social media with confidence.
                </p>
            </div>

            {/* Infinite Marquee Rows Container */}
            <div className="relative w-full overflow-hidden space-y-6 sm:space-y-8">
                
                {/* Left & Right Side Fade Gradients */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-linear-to-r from-white dark:from-black via-white/80 dark:via-black/80 to-transparent z-20" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-linear-to-l from-white dark:from-black via-white/80 dark:via-black/80 to-transparent z-20" />

                {/* Row 1: Right to Left Marquee */}
                <div className="flex overflow-hidden">
                    <div className="animate-marquee flex gap-6 sm:gap-8">
                        {row1.map((item, index) => (
                            <TestimonialCard key={`r1-${index}`} item={item} />
                        ))}
                    </div>
                </div>

                {/* Row 2: Left to Right Marquee */}
                <div className="flex overflow-hidden">
                    <div className="animate-marquee-reverse flex gap-6 sm:gap-8">
                        {row2.map((item, index) => (
                            <TestimonialCard key={`r2-${index}`} item={item} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

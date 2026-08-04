import { CheckCheck, Info, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
    {
        name: "Starter Plan",
        badgeText: "Free for",
        price: "$0",
        period: "/ Month",
        description: "Perfect for individuals trying out to management.",
        features: [
            "Manage up to 2 social profiles",
            "Schedule up to 30 posts/month",
            "Basic analytics dashboard",
            "1 user seat",
            "Email support"
        ],
        cta: "Get Started Now",
        highlight: false,
    },
    {
        name: "Professional Plan",
        badgeText: "Perfect for",
        price: "$45",
        period: "/ Month",
        description: "Built for small teams and growing brands.",
        features: [
            "Manage up to 10 social profiles",
            "Unlimited post scheduling",
            "Advanced analytics & insights",
            "3 user seats",
            "Team collaboration tools",
            "Priority email support"
        ],
        cta: "Get Started Now",
        highlight: true,
        popularBadge: "Popular Plan"
    },
    {
        name: "Business Plan",
        badgeText: "Perfect for",
        price: "$79",
        period: "/ Month",
        description: "Best for agencies and larger organizations.",
        features: [
            "Unlimited social profiles",
            "Unlimited post scheduling",
            "Full analytics & reporting",
            "10+ user seats",
            "Dedicated account manager",
            "24/7 priority support"
        ],
        cta: "Get Started Now",
        highlight: false,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-20 sm:py-28 bg-white dark:bg-black transition-colors duration-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                    {/* Top Pill Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-medium mb-5">
                        <Sparkles className="size-3.5 text-orange-500" />
                        <span>Pricing Plan</span>
                    </div>

                    {/* Main Title */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight text-slate-900 dark:text-white leading-tight">
                        Transparent Plans That <br className="hidden sm:inline" />
                        Scale With Your Need
                    </h2>

                    {/* Subtitle */}
                    <p className="mt-4 text-slate-500 dark:text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                        Choose the plan that fits your strategy. No hidden fees, no surprises—just reliable social media intelligence.
                    </p>
                </div>

                {/* 3-Column Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8 items-stretch pt-4">
                    {pricingPlans.map((plan) => {
                        return (
                            <div
                                key={plan.name}
                                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                                    plan.highlight
                                        ? "bg-linear-to-b from-orange-500/10 via-amber-500/5 to-white dark:from-orange-500/15 dark:via-zinc-900/90 dark:to-zinc-950 border-2 border-orange-500 dark:border-orange-500 shadow-2xl shadow-orange-500/15 scale-100 md:scale-[1.02] z-10"
                                        : "bg-slate-50/70 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs hover:border-orange-500/30"
                                }`}
                            >
                                {/* Top Floating Badge for Highlighted Card */}
                                {plan.highlight && plan.popularBadge && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold text-xs px-4 py-1.5 rounded-full shadow-lg shadow-orange-500/30 uppercase tracking-wider">
                                        {plan.popularBadge}
                                    </div>
                                )}

                                <div>
                                    {/* Sub-badge text */}
                                    <div className="text-center text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                                        {plan.badgeText}
                                    </div>

                                    {/* Plan Title */}
                                    <h3 className="text-center text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight mb-2">
                                        {plan.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-6 max-w-xs mx-auto">
                                        {plan.description}
                                    </p>

                                    {/* Price Header */}
                                    <div className="flex items-baseline justify-center gap-1 my-4">
                                        <span className="text-4xl sm:text-5xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
                                            {plan.price}
                                        </span>
                                        <span className="text-xs sm:text-sm text-slate-400 dark:text-zinc-500 font-medium">
                                            {plan.period}
                                        </span>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="my-6">
                                        <Link
                                            to="/login"
                                            className={`w-full inline-flex items-center justify-center py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-xs cursor-pointer ${
                                                plan.highlight
                                                    ? "bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/30 hover:scale-[1.01]"
                                                    : "bg-white dark:bg-zinc-900 border border-orange-500/40 text-orange-600 dark:text-orange-400 hover:bg-orange-500/5 dark:hover:bg-orange-500/10"
                                            }`}
                                        >
                                            {plan.cta}
                                        </Link>
                                    </div>

                                    {/* Features Divider */}
                                    <div className="w-full h-px bg-slate-200/70 dark:bg-zinc-800/80 my-6" />

                                    {/* Features List */}
                                    <ul className="space-y-3.5">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                                                <div className="flex items-center gap-2.5">
                                                    {/* Orange Double Checkmark Icon */}
                                                    <CheckCheck className="size-4 text-orange-500 shrink-0 stroke-[2.2]" />
                                                    <span className="text-slate-700 dark:text-zinc-300 font-medium">
                                                        {feature}
                                                    </span>
                                                </div>

                                                {/* Information Circle Icon on Far Right */}
                                                <div className="shrink-0 text-slate-300 dark:text-zinc-600 hover:text-slate-500 dark:hover:text-zinc-400 transition-colors cursor-pointer" title={feature}>
                                                    <Info className="size-4 stroke-[1.8]" />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

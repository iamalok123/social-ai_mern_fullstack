import { CheckIcon, CircleCheckBigIcon } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
    {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for creators just getting started with social media automation.",
        features: ["2 social accounts", "10 scheduled posts/month", "AI content (5 credits/mo)", "Basic dashboard"],
        cta: "Get Started Free",
        highlight: false,
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        description: "Everything you need to grow and automate your social presence.",
        features: ["Unlimited accounts", "Unlimited scheduling", "AI content (200 credits/mo)", "Priority support"],
        cta: "Start 14-day Free Trial",
        highlight: true,
    },
    {
        name: "Agency",
        price: "$79",
        period: "/month",
        description: "For teams and agencies managing multiple brands at scale.",
        features: ["Everything in Pro", "5 team members", "Unlimited AI credits", "Custom AI personas", "Dedicated support"],
        cta: "Contact Sales",
        highlight: false,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-white dark:bg-black transition-colors">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <div className="mb-6 inline-flex items-center gap-1.5 bg-red-500/10 dark:bg-orange-500/10 border border-red-500/15 dark:border-orange-500/20 text-red-500 dark:text-orange-400 text-[11px] font-medium tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">
                        <CircleCheckBigIcon className="size-3" />
                        Simple pricing
                    </div>
                    <h2 className="font-serif font-medium text-4xl sm:text-5xl leading-tight text-gray-900 dark:text-white">
                        Plans for every stage
                        <br />
                        <span className="text-red-400 dark:text-orange-500 italic">of growth</span>
                    </h2>
                    <p className="mt-5 text-gray-500 dark:text-zinc-400 max-w-md mx-auto">Start free, upgrade when you&apos;re ready. Cancel anytime — no hidden fees.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                    {pricingPlans.map((plan) => (
                        <div key={plan.name} className={`rounded-2xl border p-7 flex flex-col gap-6 relative transition-all ${plan.highlight ? "bg-red-500 dark:bg-orange-600 text-white border-red-400 dark:border-orange-500 shadow-2xl shadow-red-500/20 dark:shadow-orange-500/25" : "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"}`}>
                            {plan.highlight && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">Most Popular</div>}
                            <div>
                                <div className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-red-100 dark:text-orange-100" : "text-red-500 dark:text-orange-400"}`}>{plan.name}</div>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className={`text-sm mb-1.5 ${plan.highlight ? "text-red-200 dark:text-orange-200" : "text-slate-400 dark:text-zinc-400"}`}>{plan.period}</span>
                                </div>
                                <p className={`text-sm mt-2 leading-relaxed ${plan.highlight ? "text-red-100 dark:text-orange-100" : "text-slate-500 dark:text-zinc-400"}`}>{plan.description}</p>
                            </div>

                            <ul className="space-y-2.5">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2.5 text-sm">
                                        <div className={`size-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-red-400 dark:bg-orange-500" : "bg-red-50 dark:bg-orange-950/50"}`}>
                                            <CheckIcon className={`w-2.5 h-2.5 ${plan.highlight ? "text-white" : "text-red-500 dark:text-orange-400"}`} />
                                        </div>
                                        <span className={plan.highlight ? "text-red-50 dark:text-orange-50" : "text-slate-600 dark:text-zinc-300"}>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/#" className={`mt-auto text-center font-semibold text-sm px-6 py-3 rounded-full transition-all ${plan.highlight ? "bg-white text-red-500 dark:text-orange-600 hover:bg-red-50 dark:hover:bg-orange-50" : "bg-red-500 text-white hover:bg-red-600 dark:bg-orange-600 dark:hover:bg-orange-500"}`}>
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

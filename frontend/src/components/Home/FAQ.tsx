import { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare, Star, StarHalf } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "What is Social AI, and how can it help my business?",
        answer: "Social AI is an all-in-one social media management and AI content automation platform designed to schedule posts, generate captions, analyze audience engagement, and scale your brand effortlessly."
    },
    {
        question: "Can I manage multiple social media accounts at once?",
        answer: "Yes! You can connect and manage accounts across Instagram, Twitter/X, LinkedIn, Facebook, Pinterest, and TikTok from a single unified dashboard."
    },
    {
        question: "Does Social AI offer analytics and reporting?",
        answer: "Absolutely. You'll get in-depth analytics to track engagement, audience growth, and content performance—helping you make data-driven decisions."
    },
    {
        question: "Can my team collaborate on content?",
        answer: "Yes, our platform supports multi-user team workspaces with role-based permissions, post approval workflows, and collaborative content draft editing."
    },
    {
        question: "Do you provide AI tools for content creation?",
        answer: "Yes! Social AI features built-in AI generators for viral captions, trending hashtags, content idea brainstorming, and instant media optimization."
    },
    {
        question: "Is there a free trial available?",
        answer: "We offer a 14-day free trial on all plans with no credit card required, so you can explore all premium features risk-free."
    }
];

export default function FAQ() {
    // Open index 2 ("Does Social AI offer analytics and reporting?") by default to match design
    const [openIndex, setOpenIndex] = useState<number | null>(2);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-20 sm:py-28 bg-white dark:bg-black transition-colors duration-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    
                    {/* Left Column: Badge, Heading, Subtitle & Rating */}
                    <div className="lg:col-span-5 flex flex-col justify-between h-full lg:sticky lg:top-28">
                        <div>
                            {/* FAQ Pill Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-medium mb-6">
                                <MessageSquare className="size-4 text-orange-500" />
                                <span>Frequently Asked Questions</span>
                            </div>

                            {/* Main Heading */}
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight text-slate-900 dark:text-white leading-tight">
                                Have Questions?
                            </h2>

                            {/* Subtitle */}
                            <p className="mt-4 text-slate-500 dark:text-zinc-400 text-base sm:text-lg max-w-md leading-relaxed">
                                Check out our FAQ section for all the information you need.
                            </p>
                        </div>

                        {/* Social Proof / Rating Widget */}
                        <div className="mt-10 lg:mt-16 flex items-center gap-4 pt-4">
                            {/* Stacked User Avatars */}
                            <div className="flex -space-x-3 overflow-hidden p-1">
                                <img
                                    className="inline-block size-10 sm:size-11 rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover"
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                                    alt="User 1"
                                />
                                <img
                                    className="inline-block size-10 sm:size-11 rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover"
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                                    alt="User 2"
                                />
                                <img
                                    className="inline-block size-10 sm:size-11 rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover"
                                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                                    alt="User 3"
                                />
                            </div>

                            {/* Star Rating & Count */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    <div className="flex text-amber-400">
                                        <Star className="size-4 fill-amber-400 text-amber-400" />
                                        <Star className="size-4 fill-amber-400 text-amber-400" />
                                        <Star className="size-4 fill-amber-400 text-amber-400" />
                                        <Star className="size-4 fill-amber-400 text-amber-400" />
                                        <StarHalf className="size-4 fill-amber-400 text-amber-400" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white ml-1">4.0</span>
                                </div>
                                <span className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
                                    from 500+ reviews
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Accordion Questions List */}
                    <div className="lg:col-span-7 flex flex-col divide-y divide-slate-200/80 dark:divide-zinc-800/80 border-t border-b border-slate-200/80 dark:border-zinc-800/80">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div key={index} className="py-5 sm:py-6 transition-colors">
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer focus:outline-none"
                                        aria-expanded={isOpen}
                                    >
                                        <span className="text-base sm:text-lg md:text-xl font-medium sm:font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors pr-2">
                                            {faq.question}
                                        </span>

                                        {/* Icon container with soft highlight when open */}
                                        <div
                                            className={`shrink-0 p-2 sm:p-2.5 rounded-xl transition-all duration-200 ${
                                                isOpen
                                                    ? "bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 shadow-xs"
                                                    : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300"
                                            }`}
                                        >
                                            {isOpen ? (
                                                <ChevronUp className="size-4 sm:size-5" />
                                            ) : (
                                                <ChevronDown className="size-4 sm:size-5" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Animated Accordion Content */}
                                    {isOpen && (
                                        <div className="mt-3.5 pr-6 sm:pr-12 text-slate-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}

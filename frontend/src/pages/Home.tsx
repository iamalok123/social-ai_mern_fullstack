import Navbar from "../components/Home/Navbar";
import Hero from "../components/Home/Hero";
import AppShowcase from "../components/Home/AppShowcase";
import Features from "../components/Home/Features";
import HowItWorks from "../components/Home/HowItWorks";
import Pricing from "../components/Home/Pricing";
import Testimonials from "../components/Home/Testimonials";
import CTA from "../components/Home/CTA";
import FAQ from "../components/Home/FAQ";
import Footer from "../components/Home/Footer";

export default function Home() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-zinc-100 font-sans transition-colors duration-200">
            <Navbar />
            <Hero />
            <AppShowcase />
            <Features />
            <HowItWorks />
            <Pricing />
            <Testimonials />
            <CTA />
            <FAQ />
            <Footer />
        </div>
    );
}



import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailIcon, LockIcon, ArrowRightIcon, User2Icon, EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { api, API_PATHS } from "../api/axios";

export default function Login() {
    const [loginState, setLoginState] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const { login, user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = loginState ? API_PATHS.AUTH.LOGIN : API_PATHS.AUTH.REGISTER;
            const { data } = await api.post(
                endpoint,
                loginState ? { email, password } : { name, email, password }
            );

            login(data, data.token);
            toast.success(loginState ? "Logged in successfully!" : "Account created successfully!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleCredentialResponse = async (response: any) => {
        setGoogleLoading(true);
        try {
            if (!response?.credential) {
                throw new Error("No credential returned from Google.");
            }

            // Decode base64 JWT payload from Google ID Token
            const base64Url = response.credential.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            const payload = JSON.parse(jsonPayload);

            if (!payload?.email) {
                throw new Error("Google account email not found.");
            }

            const name = payload.name || payload.given_name || payload.email.split("@")[0];
            const email = payload.email;
            const picture = payload.picture;

            // Authenticate with backend
            const { data } = await api.post(API_PATHS.AUTH.GOOGLE_LOGIN, { name, email, picture });
            login(data, data.token);
            toast.success(`Signed in as ${email}!`);
            navigate("/dashboard");
        } catch (err: any) {
            toast.error(err.response?.data?.message || err?.message || "Google sign-in failed.");
        } finally {
            setGoogleLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
            return;
        }

        const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!googleClientId) {
            console.warn("VITE_GOOGLE_CLIENT_ID not set — Google Sign-In disabled.");
            return;
        }

        const setupGoogleBtn = () => {
            if ((window as any).google?.accounts?.id) {
                (window as any).google.accounts.id.initialize({
                    client_id: googleClientId,
                    callback: handleGoogleCredentialResponse,
                });

                const btnContainer = document.getElementById("googleSignInBtn");
                if (btnContainer) {
                    btnContainer.innerHTML = "";
                    (window as any).google.accounts.id.renderButton(btnContainer, {
                        theme: document.documentElement.classList.contains("dark") ? "filled_black" : "outline",
                        size: "large",
                        width: "360",
                        text: "continue_with",
                        shape: "pill",
                    });
                }
            }
        };

        if ((window as any).google?.accounts?.id) {
            setupGoogleBtn();
        } else {
            const timer = setInterval(() => {
                if ((window as any).google?.accounts?.id) {
                    setupGoogleBtn();
                    clearInterval(timer);
                }
            }, 300);
            return () => clearInterval(timer);
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-black text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 transition-colors">
            <div className="relative w-full max-w-md">
                <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800/80 p-8 transition-all">
                    <div className="flex flex-col items-center mb-8">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.svg" alt="Logo" className="size-7" />
                            <h1 className="text-2xl font-serif text-slate-900 dark:text-white">Social AI</h1>
                        </Link>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
                            {loginState ? "Sign in to your Dashboard" : "Create your Social AI account"}
                        </p>
                    </div>

                    {/* Google OAuth Button Container */}
                    <div className="flex flex-col items-center justify-center mb-6 min-h-11 relative">
                        {googleLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-zinc-950/90 z-10 rounded-full">
                                <span className="text-xs font-medium text-orange-600 dark:text-orange-400 animate-pulse">Signing in with Google...</span>
                            </div>
                        )}
                        <div id="googleSignInBtn" className="w-full flex justify-center" />
                    </div>

                    <div className="relative flex items-center justify-center mb-6">
                        <div className="border-t border-slate-200 dark:border-zinc-800 w-full" />
                        <span className="bg-white dark:bg-zinc-950 px-3 text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider absolute">or</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                        {!loginState && (
                            <div>
                                <label className="block mb-1.5 text-slate-700 dark:text-zinc-300">Name</label>
                                <div className="relative">
                                    <User2Icon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                    <input type="text" required disabled={loading || googleLoading} placeholder="Enter your name" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-white outline-orange-500 border border-slate-200 dark:border-zinc-800 rounded-full transition-all disabled:opacity-60 disabled:cursor-not-allowed" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block mb-1.5 text-slate-700 dark:text-zinc-300">Email</label>
                            <div className="relative">
                                <MailIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                <input type="email" required disabled={loading || googleLoading} placeholder="you@company.com" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-white outline-orange-500 border border-slate-200 dark:border-zinc-800 rounded-full transition-all disabled:opacity-60 disabled:cursor-not-allowed" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1.5 text-slate-700 dark:text-zinc-300">Password</label>
                            <div className="relative">
                                <LockIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                    minLength={6}
                                    disabled={loading || googleLoading}
                                    placeholder="••••••••" 
                                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-white outline-orange-500 border border-slate-200 dark:border-zinc-800 rounded-full transition-all disabled:opacity-60 disabled:cursor-not-allowed" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading || googleLoading}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 focus:outline-none transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="size-4" />
                                    ) : (
                                        <EyeIcon className="size-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading || googleLoading} className="w-full py-3 px-4 bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium rounded-full text-sm transition-all shadow-md shadow-orange-500/20 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer">
                            {loading ? (
                                "Signing in..."
                            ) : (
                                <>
                                    {loginState ? "Sign In" : "Sign Up"} <ArrowRightIcon className="size-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500 dark:text-zinc-400">
                        {loginState ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <button onClick={() => setLoginState(false)} className="text-orange-600 dark:text-orange-400 hover:underline font-medium">
                                    Create one free
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button onClick={() => setLoginState(true)} className="text-orange-600 dark:text-orange-400 hover:underline font-medium">
                                    Sign In
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockIcon, EyeIcon, EyeOffIcon, ArrowLeftIcon, ShieldCheckIcon, KeyRoundIcon } from "lucide-react";
import { toast } from "sonner";
import { api, API_PATHS } from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ChangePassword() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (user?.authProvider === "google") {
            toast.error("Password change is unavailable for Google authenticated accounts.");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.put(API_PATHS.AUTH.CHANGE_PASSWORD, {
                currentPassword,
                newPassword,
            });
            toast.success(data.message || "Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    if (user?.authProvider === "google") {
        return (
            <div className="h-full max-w-lg mx-auto flex flex-col justify-center px-4 overflow-hidden">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl text-center">
                    <div className="w-12 h-12 mx-auto bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-3">
                        <KeyRoundIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Password Change Unavailable</h2>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-5 max-w-sm mx-auto">
                        You signed in using <span className="font-semibold text-zinc-900 dark:text-white">Google Authentication</span>. Your account authentication is managed securely by Google.
                    </p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer"
                    >
                        <ArrowLeftIcon className="w-3.5 h-3.5" /> Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full max-w-lg mx-auto flex flex-col justify-center px-4 overflow-hidden">
            <div className="mb-3 flex items-center justify-between">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                    <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Dashboard
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-linear-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
                        <ShieldCheckIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-zinc-900 dark:text-white">Change Password</h1>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Update your account password securely</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Current Password */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Current Password
                        </label>
                        <div className="relative">
                            <LockIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-9 pr-9 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500 transition-all text-xs"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                            >
                                {showCurrentPassword ? <EyeOffIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <LockIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type={showNewPassword ? "text" : "password"}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-9 pr-9 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500 transition-all text-xs"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                            >
                                {showNewPassword ? <EyeOffIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Must be at least 6 characters long</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <LockIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-9 pr-9 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500 transition-all text-xs"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                            >
                                {showConfirmPassword ? <EyeOffIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-2.5">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="w-1/2 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-medium rounded-xl transition-all text-xs cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 py-2 bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium rounded-xl transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 text-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

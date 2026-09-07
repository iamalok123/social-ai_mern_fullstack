import { useState } from "react";
import { ImageIcon, PlayIcon, EyeIcon } from "lucide-react";
import type { PostThumbnailProps } from "../types";

export const PostThumbnail = ({ mediaUrl, isVideo, count, onClick }: PostThumbnailProps) => {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div className="relative shrink-0 w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200/80 dark:border-zinc-800/80 bg-slate-100 dark:bg-zinc-900/90 flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 p-1.5 text-center shadow-2xs">
                <ImageIcon className="size-4.5 mb-1 text-slate-400 dark:text-zinc-500" />
                <span className="text-[9px] font-medium leading-tight">Image offline</span>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className="relative shrink-0 w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-950 cursor-pointer group/thumb shadow-2xs"
            title="Click to preview media"
        >
            {isVideo ? (
                <>
                    <video
                        src={mediaUrl}
                        className="w-full h-full object-cover pointer-events-none"
                        onError={() => setHasError(true)}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="p-1.5 rounded-full bg-white/90 text-slate-900 group-hover/thumb:scale-110 transition-transform">
                            <PlayIcon className="size-3 fill-current" />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <img
                        src={mediaUrl}
                        alt=""
                        onError={() => setHasError(true)}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover/thumb:opacity-100">
                        <EyeIcon className="size-3.5 text-white" />
                    </div>
                </>
            )}

            {count && count > 1 && (
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-bold border border-white/20 shadow-xs">
                    +{count - 1}
                </div>
            )}
        </div>
    );
};

export default PostThumbnail;

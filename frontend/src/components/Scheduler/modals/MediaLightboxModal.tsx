import React from "react";
import { XIcon } from "lucide-react";

interface MediaLightboxModalProps {
    media: { url: string; type: "image" | "video" } | null;
    onClose: () => void;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({ media, onClose }) => {
    if (!media) return null;

    const isVideo =
        media.type === "video" ||
        /\.(mp4|webm|mov|mkv|ogg)$/i.test(media.url) ||
        media.url.includes("/video/upload/");

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
            onClick={onClose}
        >
            <div
                className="relative max-w-3xl max-h-[85vh] w-full flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer z-30 shadow-md backdrop-blur-xs"
                    title="Close preview"
                >
                    <XIcon className="size-4" />
                </button>

                {isVideo ? (
                    <video
                        src={media.url}
                        controls
                        autoPlay
                        playsInline
                        className="max-h-[80vh] w-auto max-w-full object-contain"
                    />
                ) : (
                    <img
                        src={media.url}
                        alt="preview"
                        className="max-h-[80vh] w-auto max-w-full object-contain"
                    />
                )}
            </div>
        </div>
    );
};

export default MediaLightboxModal;

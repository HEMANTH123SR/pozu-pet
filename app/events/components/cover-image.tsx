import React from 'react';
import { ImagePlus } from "lucide-react";
import Image from "next/image";

interface CoverImageProps {
    coverImage: File | null;
    coverImageName: string;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const CoverImage: React.FC<CoverImageProps> = ({
    coverImage,
    coverImageName,
    onImageUpload
}) => {
    const defaultImage = "/kampus-event-cover-image.png";
    const [previewUrl, setPreviewUrl] = React.useState<string>(defaultImage);

    React.useEffect(() => {
        if (coverImage) {
            const url = URL.createObjectURL(coverImage);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(defaultImage);
        }
    }, [coverImage]);

    return (
        <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden group">
            <Image
                src={previewUrl}
                alt="Event cover"
                fill
                className="object-cover"
            />

            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/50" />

            {/* Upload button */}
            <label
                htmlFor="cover-image-upload"
                className="absolute z-50 bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
            >
                <ImagePlus className="w-5 h-5" />
                <span className="text-sm font-medium">
                    {coverImageName || "Add cover image"}
                </span>
                <input
                    id="cover-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={onImageUpload}
                    className="hidden"
                />
            </label>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};

export default CoverImage;
import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";
import EmojiPicker from 'emoji-picker-react';
import { Theme, EmojiClickData } from 'emoji-picker-react';

interface DiscussionCreateFooterPropsInterface {
    multipleImage: boolean;
    setImage: ((file: File) => void) | null;
    setMultipleImage: ((file: File[]) => void) | null;
    handlePollSwitch: () => void;
    setShowEmojiPicker: (value: boolean) => void;
    showEmojiPicker: boolean;
    wordCount: number;
    onEmojiClick: (emojiData: EmojiClickData, event: MouseEvent) => void;
}

interface FileWithPreview extends File {
    preview: string;
}

export const MobileDiscussionCreateFooter: React.FC<DiscussionCreateFooterPropsInterface> = ({
    multipleImage,
    setImage,
    setMultipleImage,
    wordCount,
    handlePollSwitch,
    setShowEmojiPicker,
    showEmojiPicker,
    onEmojiClick
}) => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [showImagePreview, setShowImagePreview] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const picker = document.querySelector('.EmojiPickerReact');
            const button = document.querySelector('.emoji-button');
            if (picker && !picker.contains(event.target as Node) &&
                button && !button.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker, setShowEmojiPicker]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map((file) =>
                Object.assign(file, { preview: URL.createObjectURL(file) })
            );
            setFiles((prev) => (multipleImage ? [...prev, ...newFiles] : newFiles));
            setShowImagePreview(true);

            if (setImage && !multipleImage) {
                setImage(newFiles[0]);
            }
            if (setMultipleImage) {
                setMultipleImage(newFiles);
            }
        }
    };

    const removeFile = (name: string) => {
        setFiles((currentFiles) => {
            const updatedFiles = currentFiles.filter((file) => file.name !== name);
            if (updatedFiles.length === 0) {
                setShowImagePreview(false);
            }
            return updatedFiles;
        });

        if (setMultipleImage) {
            setMultipleImage(files.filter(file => file.name !== name));
        }
    };

    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    return (
        <div className="flex flex-col w-full">
            {/* Image Preview Section */}
            {showImagePreview && files.length > 0 && (
                <div className="px-4 py-2 border-t border-darkBorder">
                    <ScrollArea className="w-full">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48">
                            {files.map((file) => (
                                <figure
                                    className="relative aspect-square rounded-lg overflow-hidden"
                                    key={file.name}
                                >
                                    <Image
                                        src={file.preview}
                                        alt={file.name}
                                        fill
                                        className="object-cover"
                                        onLoad={() => {
                                            URL.revokeObjectURL(file.preview);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                                        onClick={() => removeFile(file.name)}
                                    >
                                        <RxCross2 className="w-4 h-4 text-white" />
                                    </button>
                                </figure>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}

            {/* Word Count */}
            <div className="px-4 py-2 flex justify-end">
                <span className="text-xs text-gray-400">
                    {wordCount}/2000
                </span>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-darkBorder bg-darkBackground">
                <div className="flex items-center gap-6">
                    <label
                        htmlFor="mobile-image-upload"
                        className="flex items-center justify-center text-darkTextSecondery"
                    >
                        <input
                            type="file"
                            id="mobile-image-upload"
                            accept="image/*"
                            multiple={multipleImage}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <DynamicSvgIcon
                            isActive={false}
                            src='/image.svg'
                            size={24}
                        />
                    </label>

                    <div className="relative">
                        <button
                            className="emoji-button text-darkTextSecondery mt-2"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <DynamicSvgIcon
                                src='/smile-emoji.svg'
                                isActive={false}
                                size={25}
                            />
                        </button>
                        {showEmojiPicker && (
                            <div className="absolute bottom-12 left-0 z-50">
                                <div className="max-w-[320px] sm:max-w-none">
                                    <EmojiPicker
                                        theme={Theme.DARK}
                                        onEmojiClick={onEmojiClick}
                                        autoFocusSearch={false}
                                        lazyLoadEmojis={true}
                                        width="100%"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        className="text-darkTextSecondery"
                        onClick={handlePollSwitch}
                    >
                        <DynamicSvgIcon
                            src='/flex-icon-set/poll.svg'
                            isActive={false}
                            size={25}
                        />
                    </button>
                </div>

                <span className=" text-darkTextSecondery text-lg ">
                    Type @ to mention
                </span>
            </div>
        </div>
    );
};
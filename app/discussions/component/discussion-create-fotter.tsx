import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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

export const DiscussionCreateFooter: React.FC<DiscussionCreateFooterPropsInterface> = ({
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

  // Handle click outside emoji picker
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

      if (setImage && !multipleImage) {
        setImage(newFiles[0]);
      }
      if (setMultipleImage) {
        setMultipleImage(newFiles);
      }
    }
  };

  const removeFile = (name: string) => {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => file.name !== name)
    );

    // Update parent state when removing files
    if (setMultipleImage) {
      setMultipleImage(files.filter(file => file.name !== name));
    }
  };

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <div className="flex flex-col space-y-3">
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-4 gap-2">
          {files.map((file) => (
            <figure
              className="relative overflow-hidden rounded-md h-24 w-auto"
              key={file.name}
            >
              <Image
                src={file.preview}
                alt={file.name}
                width={500}
                height={600}
                className="object-cover w-full h-full"
                onLoad={() => {
                  URL.revokeObjectURL(file.preview);
                }}
              />
              <button
                type="button"
                className="w-5 m-1.5 h-5 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute top-0 right-0 hover:bg-slate-50 bg-white transition-colors"
                onClick={() => removeFile(file.name)}
              >
                <RxCross2
                  className="w-3 h-3 fill-white hover:fill-secondary-400 transition-colors"
                  strokeWidth={1.7}
                />
              </button>
            </figure>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <div className="flex w-full justify-end items-end">
        <div className="text-sm text-gray-400">{wordCount}/2000</div>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-darkBorder">
        <div className="flex items-center gap-3 space-x-1">
          <label
            htmlFor="image-upload"
            className="flex justify-center text-text_secondary items-center cursor-pointer hover:scale-125 group rounded-md transition-colors"
          >
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple={multipleImage}
              onChange={handleFileChange}
              className="hidden"
            />
            <DynamicSvgIcon
              isActive={false}
              src='/image.svg'
              size={20}
            />
          </label>

          <div className="relative mt-2">
            <button
              className="emoji-button hover:scale-125 text-text_secondary group rounded-md transition-colors"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <DynamicSvgIcon
                src='/smile-emoji.svg'
                isActive={false}
                size={22}
              />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-50">
                <EmojiPicker
                  theme={Theme.DARK}
                  onEmojiClick={onEmojiClick}
                  autoFocusSearch={false}
                  lazyLoadEmojis={true}
                />
              </div>
            )}
          </div>

          <button
            className="hover:scale-125 text-text_secondary group rounded-md transition-colors"
            onClick={handlePollSwitch}
          >
            <DynamicSvgIcon
              src='/flex-icon-set/poll.svg'
              isActive={false}
              size={22}
            />
          </button>
        </div>

        <span className="text-sm text-gray-400 dark:text-text_secondary">
          Type @ to mention people and clubs and institute
        </span>
      </div>
    </div>
  );
};


"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";
import { hackerMedium } from "@/fonts/font";

import { Twitter, Facebook, Instagram, Linkedin, Copy, Check, X } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ShareDialog = ({ id, triggerText = "Share" }: { id: string, triggerText?: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const url = `https://www.kampus.social/discussions/${id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000); // Reset after 2 seconds
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnInstagram = () => {
    copyToClipboard();
    alert("Instagram sharing typically requires the mobile app. Link copied to clipboard instead.");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="py-1  rounded-md transition-colors" aria-label="Open Share Dialog">
          <DynamicSvgIcon
            isActive={false}
            size={22}
            src="/share.svg"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md p-6 flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            <div className='flex items-center gap-2 justify-between'>
              <span className={`${hackerMedium.className} text-2xl`}>
                Share
              </span>
              <DialogClose asChild>
                <button className="px-2  rounded-md">
                  <X className='w-4 h-4' />
                </button>
              </DialogClose>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 w-full justify-between">
          <button
            className="flex flex-col items-center gap-2 transition-transform hover:scale-105"
            aria-label="Share on Twitter"
            onClick={shareOnTwitter}
          >
            <div className="bg-[#262626] p-3 rounded-full hover:bg-[#444444] transition-colors">
              <Twitter className="w-6 h-6" />
            </div>
            <p className="text-sm font-light">Twitter</p>
          </button>

          <button
            className="flex flex-col items-center gap-2 transition-transform hover:scale-105"
            aria-label="Share on Facebook"
            onClick={shareOnFacebook}
          >
            <div className="bg-[#262626] p-3 rounded-full hover:bg-[#444444] transition-colors">
              <Facebook className="w-6 h-6" />
            </div>
            <p className="text-sm font-light">Facebook</p>
          </button>

          <button
            className="flex flex-col items-center gap-2 transition-transform hover:scale-105"
            aria-label="Share on Instagram"
            onClick={shareOnInstagram}
          >
            <div className="bg-[#262626] p-3 rounded-full hover:bg-[#444444] transition-colors">
              <Instagram className="w-6 h-6" />
            </div>
            <p className="text-sm font-light">Instagram</p>
          </button>

          <button
            className="flex flex-col items-center gap-2 transition-transform hover:scale-105"
            aria-label="Share on LinkedIn"
            onClick={shareOnLinkedIn}
          >
            <div className="bg-[#262626] p-3 rounded-full hover:bg-[#444444] transition-colors">
              <Linkedin className="w-6 h-6" />
            </div>
            <p className="text-sm font-light">LinkedIn</p>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-base font-medium">Page Link</h2>
          <div className="flex items-center gap-2 bg-[#262626] p-3 rounded-md w-full">
            <p className="text-sm font-light truncate flex-grow">{url}</p>
            <button
              className="p-2 rounded-md hover:bg-[#444444] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={copyToClipboard}
              aria-label={isCopied ? "Copied!" : "Copy link to clipboard"}
            >
              {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}

export default ShareDialog
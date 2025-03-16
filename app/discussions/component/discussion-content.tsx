"use client";
import Image from "next/image";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useMotionValue } from "framer-motion";
import { getImage } from "@/lib/appwrite/appwrite";
import { hackerMedium } from "@/fonts/font";

export function DiscussionContent({
  title,
  content,
  images,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  link,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tags,
}: {
  title?: string;
  content: string;
  images: string[];
  link?: string;
  tags: string[];
}) {
  const [imageUrls, setImageUrls] = useState<(string | undefined)[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const IMAGE_WIDTH = "80%";
  const GAP = 8;
  const CHARACTER_LIMIT = 500;
  const shouldTruncate = content.length > CHARACTER_LIMIT;
  const capitalizedContent = content.charAt(0).toUpperCase() + content.slice(1);
  const truncatedContent = shouldTruncate && !isExpanded
    ? capitalizedContent.slice(0, CHARACTER_LIMIT).trim() + "..."
    : capitalizedContent;

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoadingImages(true);
        const urls = await Promise.all(
          images.slice(0, 4).map(async (imageId) => {
            try {
              return await getImage(imageId);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              return undefined;
            }
          })
        );
        setImageUrls(urls.filter(url => url !== undefined));
      } finally {
        setLoadingImages(false);
      }
    };

    if (images.length > 0) loadImages();
  }, [images]);

  useEffect(() => {
    const updateWidth = () => {
      if (sliderRef.current) {
        setContainerWidth(sliderRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const dragConstraints = useMemo(() => {
    if (!containerWidth || !imageUrls.length) return { right: 0, left: 0 };
    const imageWidth = (containerWidth * 0.8) + GAP;
    const totalWidth = imageWidth * imageUrls.length;
    return {
      right: 0,
      left: -Math.max(0, totalWidth - containerWidth)
    };
  }, [containerWidth, imageUrls.length]);

  return (
    <div className="discussion-content max-w-full w-full">
      {title && (
        <h1 style={hackerMedium.style} className="pb-1.5 text-black dark:text-darkTextPrimary">
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </h1>
      )}

      <div className="space-y-1">
        <div className="text-base text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line break-words">
          {truncatedContent.trim()}
        </div>

        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/50 font-medium transition-colors"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {images.length === 1 && (
        <div className="mt-2 rounded-md  h-[200px] md:h-[280px] w-full relative">
          {loadingImages ? (
            <div className="w-full h-full bg-gray-100 animate-pulse" />
          ) : (
            <Image
              src={imageUrls[0] || ''}
              alt="Single image"
              className="object-cover select-none rounded-2xl border border-darkBorder bg-darkBackground"
              fill
              sizes="(max-width: 768px) 100vw, 100%"
              priority
              draggable={false}
              onError={() => {
                setImageUrls([]);
              }}
            />
          )}
        </div>
      )}


      {images.length > 1 && (
        <div ref={sliderRef} className="mt-2 overflow-hidden rounded-md h-[200px] md:h-[280px]"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onDrag={(e) => {
            e.stopPropagation();
          }}

          onDragEnd={(e) => {
            e.stopPropagation();
          }}
        >
          {loadingImages ? (
            <div className="w-full h-full bg-gray-100 animate-pulse" />
          ) : (
            <motion.div
              className="flex gap-2 h-full touch-pan-x"
              drag="x"
              dragConstraints={dragConstraints}
              dragElastic={0.1}
              style={{ x }}
            >
              {imageUrls.map((url, index) => (
                <motion.div
                  key={index}
                  style={{ width: IMAGE_WIDTH }}
                  className="flex-none relative h-full"
                >
                  {url ? (
                    <Image
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="object-cover select-none rounded-2xl border border-darkBorder bg-darkBackground"
                      fill
                      sizes={`(max-width: 768px) 80vw, 80%`}
                      priority={index === 0}
                      draggable={false}
                      onError={() => {
                        setImageUrls(prev =>
                          prev.map((prevUrl, i) => i === index ? undefined : prevUrl)
                        );
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                      <span className="text-sm text-gray-500">Failed to load image</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}

    </div>
  );
}
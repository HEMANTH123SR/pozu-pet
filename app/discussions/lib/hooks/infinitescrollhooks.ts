// app/discussions/hooks/useInfiniteScroll.ts
import { useCallback, useRef } from "react";

export const useInfiniteScroll = (callback: () => void) => {
  const observer = useRef<IntersectionObserver | null>(null);

  return useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            callback();
          }
        },
        {
          rootMargin: "100px",
        }
      );

      if (node) observer.current.observe(node);
    },
    [callback]
  );
};

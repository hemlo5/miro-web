'use client';

import React, { useEffect, useRef } from 'react';

interface CustomVideoProps {
  src: string;
  className?: string;
  muted?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: string;
}

export function CustomVideo({ src, className, ...props }: CustomVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;
    let isFadingOut = false;
    let isFadingIn = false;
    let currentOpacity = 0;

    video.style.opacity = '0';

    const fade = (targetOpacity: number, duration: number, callback?: () => void) => {
      const startOpacity = currentOpacity;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
        
        if (videoRef.current) {
          videoRef.current.style.opacity = currentOpacity.toString();
        }

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else if (callback) {
          callback();
        }
      };

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleCanPlay = () => {
      if (!isFadingIn && currentOpacity === 0) {
        isFadingIn = true;
        fade(1, 500, () => {
          isFadingIn = false;
        });
      }
    };

    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 0.55 && !isFadingOut) {
        isFadingOut = true;
        fade(0, 500);
      }
    };

    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
      isFadingOut = false;
      isFadingIn = true;
      fade(1, 500, () => {
        isFadingIn = false;
      });
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      {...props}
    />
  );
}

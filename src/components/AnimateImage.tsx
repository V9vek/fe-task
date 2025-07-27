"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
}) => {
  return (
    <div className="flex w-full items-center justify-center overflow-visible p-0 sm:p-10">
      <div className="w-full">
        <div className="relative w-full">
          {/* <div className="bg-primary/50 dark:bg-primary/70 absolute inset-0 scale-110 rounded-full blur-[150px]" /> */}
          <div className="bg-primary/30 dark:bg-primary/50 absolute inset-0 scale-95 rounded-fu ll blur-[100px]" />
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn("relative z-10", className)}
            style={{
              width: "100%",
              height: "auto",
            }}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedImage;

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Outfit } from "next/font/google";
import DotPattern from "@/components/magic-ui/dot-pattern";
import BlurIn from "@/components/magic-ui/blur-in";
import AnimatedGradientText from "@/components/magic-ui/animated-gradient-text";
import AnimatedImage from "@/components/AnimateImage";
import NumberTicker from "@/components/magic-ui/number-ticker";

const outfit = Outfit({ subsets: ["latin"] });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div className={outfit.className}>
      <main className="flex min-h-screen flex-col overflow-auto">
        <div
          ref={containerRef}
          className="relative z-0 min-h-[calc(100vh-72px)] w-full overflow-hidden pb-40"
        >
          <motion.div
            className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col items-center justify-start space-y-4 px-4 pt-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <DotPattern
              className={cn(
                "absolute inset-0 z-0 [mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]",
              )}
            />

            <AnimatedGradientText>
              🚀 Effortless Store Management
            </AnimatedGradientText>

            <motion.div variants={itemVariants}>
              <BlurIn
                word={
                  <>
                    Your products, your rules.{" "}
                    <br className="hidden sm:block" />
                    Manage inventory with lightning speed.
                  </>
                }
                className="font-display -z-10 mx-auto max-w-4xl text-center text-4xl font-bold lg:w-auto"
                duration={1}
              />
            </motion.div>

            <motion.h2
              className="text-opacity-60 mx-auto max-w-2xl text-center text-xl"
              variants={itemVariants}
            >
              Trusted by <NumberTicker value={5000} />+ businesses to track
              stock, pricing, and performance—all in one place.
            </motion.h2>

            <motion.div variants={itemVariants} className="z-20">
              <Link href="/products">
                <Button size="lg" className="text-md px-8 py-3">
                  Launch Dashboard
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} style={{ scale: scale }}>
              <AnimatedImage
                src="/image.png"
                alt="Store Management Illustration"
                width={3000}
                height={2000}
                className="h-auto w-full max-w-[90vw] rounded-2xl shadow-md"
              />
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

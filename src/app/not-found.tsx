"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-background text-center text-foreground p-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="max-w-md text-muted-foreground">The page you are looking for could not be found.</p>
      <Link href="/products">
        <Button>Back to Products</Button>
      </Link>
    </div>
  );
} 
"use client";

import * as React from "react";
import Image from "next/image";
import { useProduct } from "@/hooks/product";
import { ArrowLeft, Star } from "lucide-react";
import { useRouter } from "next/navigation";

function StarRating({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < full ? "fill-current" : "stroke-current"}
          size={14}
        />
      ))}
      <span className="text-muted-foreground ml-2 text-sm font-medium">
        {value?.toFixed(1)}
      </span>
    </div>
  );
}

export default function ProductDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: product, isLoading, isError } = useProduct(id);
  const [activeImage, setActiveImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (product) {
      setActiveImage(product.images?.[0] ?? product.thumbnail);
    }
  }, [product]);

  if (isLoading) {
    return (
      <section className="space-y-4 px-8 py-6 animate-pulse">
        <div className="h-8 w-32 rounded-md bg-muted" />
        <div className="mx-auto grid max-w-7xl items-start gap-8 xl:grid-cols-[420px_1fr]">
          <div className="aspect-square w-full rounded-md bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded-md bg-muted" />
            <div className="h-6 w-1/3 rounded-md bg-muted" />
            <div className="h-10 w-1/2 rounded-md bg-muted" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-6 w-full rounded-md bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (isError || !product)
    return <div className="p-6">Failed to load product</div>;

  const descriptionBullets = product.description.split(".").filter(Boolean);

  return (
    <section className="space-y-4 px-8 py-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-muted-foreground w-max cursor-pointer text-sm border px-2 py-1 rounded-md"
      >
        <div className="flex items-center gap-2">
          <ArrowLeft className="h-3 w-4" /> Back
        </div>
      </button>
      <div className="mx-auto grid max-w-7xl items-start gap-8 xl:grid-cols-[420px_1fr]">
        {/* Image gallery */}
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-md border">
            <Image
              src={activeImage ?? product.thumbnail}
              fill
              alt={product.title}
              className="object-contain"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto p-2">
              {product.images.map((src) => (
                <button
                  key={src}
                  onClick={() => setActiveImage(src)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border transition-all duration-200 ${activeImage === src ? "ring-primary -translate-y-0.5 shadow-lg ring-2 ring-offset-2" : "hover:ring-muted-foreground/50 hover:ring-1"}`}
                >
                  <Image
                    src={src}
                    fill
                    alt={product.title}
                    className="rounded object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Meta: Barcode & QR */}
          {(product.meta?.barcode ?? product.meta?.qrCode) && (
            <div className="mt-4 space-y-2 text-center">
              {product.meta?.qrCode && (
                <div className="relative mx-auto h-28 w-28">
                  <Image
                    src={product.meta.qrCode}
                    alt="QR Code"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              {product.meta?.barcode && (
                <div className="text-muted-foreground font-mono text-xs">
                  Barcode:{" "}
                  <span className="text-foreground font-semibold">
                    {product.meta.barcode}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-4">
          <h1 className="text-3xl leading-tight font-semibold">
            {product.title}
          </h1>

          <div className="flex items-center gap-4">
            <StarRating value={product.rating} />
            {product.reviews && (
              <span className="text-muted-foreground text-sm">
                {product.reviews.length} reviews
              </span>
            )}
          </div>

          <div className="text-primary flex items-baseline gap-2 text-4xl font-bold">
            {typeof product.price === "number"
              ? `$${product.price.toLocaleString()}`
              : "-"}
            {product.discountPercentage && (
              <span className="text-lg font-medium text-red-500 line-through opacity-60">
                $
                {(
                  product.price /
                  (1 - product.discountPercentage / 100)
                ).toLocaleString()}
              </span>
            )}
          </div>

          {/* Category, Status & Tags */}
          <div className="space-y-1">
            <div className="flex flex-wrap gap-2">
              {/* Stock status chip */}
              {(() => {
                const status = (product.availabilityStatus ?? "").toLowerCase();
                const colorClass = status.includes("out")
                  ? "bg-red-100 text-red-700"
                  : status.includes("low")
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"; // default to in-stock green
                return (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}
                  >
                    {product.availabilityStatus}
                  </span>
                );
              })()}

              {product.stock > 0 && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  {product.stock} left
                </span>
              )}

              {product.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-muted/50 rounded-full border px-3 py-1 text-xs capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-muted-foreground mb-1 text-sm font-medium">
              Description:
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {descriptionBullets.map((item, idx) => (
                <li key={idx}>{item.trim()}</li>
              ))}
            </ul>
          </div>

          {/* Info Cards */}
          {(product.dimensions ??
            product.shippingInformation ??
            product.warrantyInformation) && (
            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                Shipping Information
              </h3>
              <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {product.dimensions && (
                  <div className="space-y-1 rounded border p-3 text-center">
                    <span className="block text-sm font-medium">
                      Dimensions
                    </span>
                    <span>
                      {product.dimensions.width} × {product.dimensions.height} ×{" "}
                      {product.dimensions.depth} cm
                    </span>
                  </div>
                )}
                {product.shippingInformation && (
                  <div className="space-y-1 rounded border p-3 text-center">
                    <span className="block text-sm font-medium">Shipping</span>
                    <span>{product.shippingInformation}</span>
                  </div>
                )}
                {product.warrantyInformation && (
                  <div className="space-y-1 rounded border p-3 text-center">
                    <span className="block text-sm font-medium">Warranty</span>
                    <span>{product.warrantyInformation}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-muted-foreground text-sm font-medium">
                Available Colors
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="rounded border px-3 py-1 text-xs capitalize"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.reviews && product.reviews.length > 0 && (
            <div className="space-y-3 pt-6">
              <h3 className="text-lg font-semibold">Reviews</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {product.reviews.map((review, idx) => (
                  <div key={idx} className="space-y-2 rounded border p-4">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>{review.reviewerName}</span>
                      <StarRating value={review.rating} />
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {new Date(review.date).toDateString()}
                    </p>
                    <p className="text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

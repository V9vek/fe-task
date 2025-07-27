"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddProduct, useUpdateProduct } from "@/hooks/product";
import type { Product } from "@/types/product";
import { toast } from "react-toastify";
import { productSchema, type ProductFormData } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// categories and availability options (could also fetch dynamically)
const categories: string[] = [
  "smartphones",
  "laptops",
  "fragrances",
  "skincare",
  "groceries",
  "home-decoration",
  "furniture",
  "tops",
  "womens-dresses",
  "womens-shoes",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "womens-watches",
  "womens-bags",
  "womens-jewellery",
  "sunglasses",
  "automotive",
  "motorcycle",
  "lighting",
];

const availabilityStatuses: string[] = [
  "In Stock",
  "Low Stock",
  "Out of Stock",
];

type FormValues = ProductFormData;

interface Props {
  defaultValues?: Partial<Product>;
  afterSubmit?: () => void;
}

export default function ProductForm({ defaultValues, afterSubmit }: Props) {
  const isEdit = Boolean(defaultValues?.id);
  const router = useRouter();
  const addMutation = useAddProduct();
  const updateMutation = useUpdateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      stock: defaultValues?.stock ?? 0,
      category: defaultValues?.category ?? "",
      brand: defaultValues?.brand ?? "",
      thumbnail: defaultValues?.thumbnail ?? "",
      discountPercentage: defaultValues?.discountPercentage ?? 0,
      rating: defaultValues?.rating ?? 0,
      sku: defaultValues?.sku ?? "",
      weight: defaultValues?.weight ?? 0,
      warrantyInformation: defaultValues?.warrantyInformation ?? "",
      shippingInformation: defaultValues?.shippingInformation ?? "",
      availabilityStatus: defaultValues?.availabilityStatus ?? "In Stock",
      returnPolicy: defaultValues?.returnPolicy ?? "",
      minimumOrderQuantity: defaultValues?.minimumOrderQuantity ?? 1,
    },
  });

  const watchedCategory = watch("category");
  const watchedAvailabilityStatus = watch("availabilityStatus");

  async function onSubmit(values: FormValues) {
    if (isEdit && defaultValues?.id) {
      console.log(values);
      updateMutation.mutate(
        { id: defaultValues.id, payload: values },
        {
          onSuccess: () => {
            toast.success("Product updated");
            if (afterSubmit) {
              afterSubmit();
            } else {
              router.push("/products");
            }
          },
          onError: () => toast.error("Failed to update product"),
        },
      );
    } else {
      addMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Product added");
          if (afterSubmit) {
            afterSubmit();
          } else {
            router.push("/products");
          }
        },
        onError: () => toast.error("Failed to add product"),
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-h-[80vh] space-y-8 overflow-y-auto p-6"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Title */}
        <div className="space-y-1">
          <Label>Title *</Label>
          <Input {...register("title")} />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Brand */}
        <div className="space-y-1">
          <Label>Brand</Label>
          <Input {...register("brand")} />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <Label>Category *</Label>
          <Select
            value={watchedCategory}
            onValueChange={(v) => setValue("category", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-xs text-red-500">{errors.category.message}</p>
          )}
        </div>

        {/* SKU */}
        <div className="space-y-1">
          <Label>SKU *</Label>
          <Input {...register("sku")} />
          {errors.sku && (
            <p className="text-xs text-red-500">{errors.sku.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-1">
          <Label>Price *</Label>
          <Input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>

        {/* Stock */}
        <div className="space-y-1">
          <Label>Stock *</Label>
          <Input
            type="number"
            {...register("stock", { valueAsNumber: true })}
          />
          {errors.stock && (
            <p className="text-xs text-red-500">{errors.stock.message}</p>
          )}
        </div>

        {/* Discount */}
        <div className="space-y-1">
          <Label>Discount %</Label>
          <Input
            type="number"
            step="0.01"
            {...register("discountPercentage", { valueAsNumber: true })}
          />
        </div>

        {/* Rating */}
        <div className="space-y-1">
          <Label>Rating</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="5"
            {...register("rating", { valueAsNumber: true })}
          />
        </div>

        {/* Weight */}
        <div className="space-y-1">
          <Label>Weight (kg) *</Label>
          <Input
            type="number"
            step="0.01"
            {...register("weight", { valueAsNumber: true })}
          />
        </div>

        {/* MOQ */}
        <div className="space-y-1">
          <Label>Min Order Qty *</Label>
          <Input
            type="number"
            min="1"
            {...register("minimumOrderQuantity", { valueAsNumber: true })}
          />
        </div>

        {/* Availability */}
        <div className="space-y-1">
          <Label>Availability *</Label>
          <Select
            value={watchedAvailabilityStatus}
            onValueChange={(v) => setValue("availabilityStatus", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {availabilityStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Thumbnail */}
        <div className="space-y-1 md:col-span-2">
          <Label>Thumbnail URL *</Label>
          <Input {...register("thumbnail")} />
          {errors.thumbnail && (
            <p className="text-xs text-red-500">{errors.thumbnail.message}</p>
          )}
        </div>
      </div>

      {/* Large textareas */}
      <div className="space-y-1">
        <Label>Description *</Label>
        <Textarea rows={3} {...register("description")} />
      </div>

      <div className="space-y-1">
        <Label>Warranty Information *</Label>
        <Textarea rows={2} {...register("warrantyInformation")} />
      </div>

      <div className="space-y-1">
        <Label>Shipping Information *</Label>
        <Textarea rows={2} {...register("shippingInformation")} />
      </div>

      <div className="space-y-1">
        <Label>Return Policy *</Label>
        <Textarea rows={2} {...register("returnPolicy")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isEdit ? "Update Product" : "Add Product"}
      </Button>
    </form>
  );
}

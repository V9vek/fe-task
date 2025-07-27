"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddProduct, useUpdateProduct } from "@/hooks/product";
import type { Product } from "@/types/product";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),
  category: z.string().optional(),
  brand: z.string().optional(),
  thumbnail: z.string().url("Must be a valid URL"),
});

type FormValues = z.infer<typeof schema>;

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
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      stock: defaultValues?.stock ?? 0,
      category: defaultValues?.category ?? "",
      brand: defaultValues?.brand ?? "",
      thumbnail: defaultValues?.thumbnail ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (isEdit && defaultValues?.id) {
      updateMutation.mutate(
        { id: defaultValues.id, payload: values },
        {
          onSuccess: () => {
            toast.success("Product updated");
            afterSubmit ? afterSubmit() : router.push("/products");
          },
          onError: () => toast.error("Failed to update product"),
        },
      );
    } else {
      addMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Product added");
          afterSubmit ? afterSubmit() : router.push("/products");
        },
        onError: () => toast.error("Failed to add product"),
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto p-6">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input {...register("title")}/>
        {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea rows={4} {...register("description")}/>
        {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <Input type="number" step="0.01" {...register("price")}/>
          {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <Input type="number" {...register("stock")}/>
          {errors.stock && <p className="text-xs text-red-600">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input {...register("category")}/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <Input {...register("brand")}/>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
        <Input {...register("thumbnail")}/>
        {errors.thumbnail && <p className="text-xs text-red-600">{errors.thumbnail.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isEdit ? "Update Product" : "Add Product"}
      </Button>
    </form>
  );
} 
"use client";

import { useParams } from "next/navigation";
import ProductForm from "@/components/product-form";
import { useProduct } from "@/hooks/product";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data, isLoading } = useProduct(id);

  if (isLoading || !data) return <div className="p-6">Loading...</div>;

  return <ProductForm defaultValues={data} />;
} 
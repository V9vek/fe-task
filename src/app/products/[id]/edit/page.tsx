"use client";

import { useParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import ProductForm from "@/components/product-form";
import { useProduct } from "@/hooks/product";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data, isLoading } = useProduct(id);

  if (isLoading || !data) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <ProductForm defaultValues={data} />
      </div>
    </div>
  );
} 
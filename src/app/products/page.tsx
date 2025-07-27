import ProductTable from "@/components/product-table";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "All Products – MyShop",
};

export default function ProductsPage() {
  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Store Management</h1>
        <Button>+ New Product</Button>
      </div>
      <ProductTable />
    </main>
  );
} 
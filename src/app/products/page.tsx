"use client";

import ProductTable from "@/components/product-table";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/product-form";
import { useState } from "react";

export default function ProductsPage() {
  console.log("rendered")
  const [adding, setAdding] = useState(false);

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Store Management</h1>
        <Button onClick={() => setAdding(true)}>+ New Product</Button>
      </div>

      <ProductTable />

      {adding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setAdding(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-md bg-background shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductForm afterSubmit={() => setAdding(false)} />
          </div>
        </div>
      )}
    </main>
  );
} 
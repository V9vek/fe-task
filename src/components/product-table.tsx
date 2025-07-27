"use client"

import * as React from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import Image from "next/image";

import { DataTable } from "./table/data-table";
import { DataTableColumnHeader } from "./table/data-table-column-header";
import { useProducts } from "@/hooks/product";
import type { Product, ProductsListResponse } from "@/types/product";
import { useRouter } from "next/navigation";
import { DataTableRowActions } from "./table/data-table-row-actions";
import { useDeleteProduct } from "@/hooks/product";
import { toast } from "react-toastify";

export default function ProductTable() {
  const router = useRouter();
  const deleteMutation = useDeleteProduct();

  function handleDelete(id: number) {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Product deleted"),
      onError: () => toast.error("Failed to delete product"),
    });
  }

  const columns: ColumnDef<Product & { label?: string }>[] = React.useMemo(
    () => [
      {
        id: "thumbnail",
        header: () => <span className="sr-only">Thumbnail</span>,
        cell: ({ row }) => (
          <Image
            src={row.original.thumbnail}
            alt={row.original.title}
            width={40}
            height={40}
            className="object-cover rounded"
          />
        ),
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Product" />
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => {
          const price: number = row.getValue("price");
          return <span>${price.toFixed(2)}</span>;
        },
      },
      {
        accessorKey: "rating",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Rating" />
        ),
      },
      {
        accessorKey: "stock",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Stock" />
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const product = row.original as Product;
          return (
            <DataTableRowActions
              row={product as Product & { label?: string }}
              onDelete={() => handleDelete(product.id)}
            />
          );
        },
      },
    ],
    [],
  );

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useProducts({
    limit: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
  });

  const products = (productsResponse as ProductsListResponse | undefined)?.products ?? [];
  const total = (productsResponse as ProductsListResponse | undefined)?.total ?? 0;
  const pageCount = Math.ceil(total / pagination.pageSize);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <DataTable
      data={products}
      columns={columns}
      filters={[]}
      manualPagination
      pageCount={pageCount}
      state={{ pagination }}
      onPaginationChange={setPagination}
      onRowClick={(row: Product) => router.push(`/products/${row.id}`)}
    />
  );
} 
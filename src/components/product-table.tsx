"use client"

import * as React from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import Image from "next/image";

import { DataTable } from "./table/data-table";
import { DataTableColumnHeader } from "./table/data-table-column-header";
import { useProducts } from "@/hooks/product";
import type { Product, ProductsListResponse } from "@/types/product";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { DataTableRowActions } from "./table/data-table-row-actions";
import { useDeleteProduct } from "@/hooks/product";
import { toast } from "react-toastify";
import ProductForm from "@/components/product-form";
import { useDebounce } from "@/lib/use-debounce";

export default function ProductTable() {
  const router = useRouter();
  const deleteMutation = useDeleteProduct();
  const [editing, setEditing] = React.useState<Product | null>(null);
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = React.useState("");
  const search = useDebounce(searchInput, 400);

  function handleDelete(id: number) {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Product deleted"),
      onError: () => toast.error("Failed to delete product"),
    });
  }

  function handleEdit(p: Product) {
    setEditing(p);
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
          const price = row.getValue<number>("price");
          return <span>{typeof price === "number" ? `$${price.toFixed(2)}` : "-"}</span>;
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
              onEdit={() => handleEdit(product)}
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
    isFetching,
  } = useProducts({
    limit: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
    q: search || undefined,
  });

  const products = productsResponse?.products ?? [];
  const total = productsResponse?.total ?? 0;
  const pageCount = Math.ceil(total / pagination.pageSize);

  React.useEffect(() => {
    // reset to first page when search term changes
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [search]);

  const displayData = products;

  const firstLoad = isLoading && productsResponse === undefined;

  if (firstLoad) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <>
      <DataTable
        data={displayData}
        columns={columns}
        filters={[]}
        manualPagination
        pageCount={pageCount}
        state={{ pagination }}
        onPaginationChange={setPagination}
        search={searchInput}
        onSearch={setSearchInput}
        onRowClick={(row: Product) => router.push(`/products/${row.id}`)}
      />

      {isFetching && !firstLoad && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60">
          <span className="animate-pulse text-muted-foreground">Loading...</span>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="bg-background rounded-md shadow-lg w-full max-w-xl max-h-[90vh] overflow-auto" onClick={(e)=>e.stopPropagation()}>
            <ProductForm defaultValues={editing} afterSubmit={() => setEditing(null)} />
          </div>
        </div>
      )}
    </>
  );
} 
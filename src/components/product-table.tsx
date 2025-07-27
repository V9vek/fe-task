"use client";

import * as React from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import Image from "next/image";

import { DataTable } from "./table/data-table";
import { DataTableColumnHeader } from "./table/data-table-column-header";
import { useProducts } from "@/hooks/product";
import type { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { SquarePen, Star, Trash2 } from "lucide-react";
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
            className="rounded object-cover"
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
          return (
            <span>
              {typeof price === "number" ? `$${price.toFixed(2)}` : "-"}
            </span>
          );
        },
      },
      {
        accessorKey: "rating",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Rating" />
        ),
        cell: ({ row }) => {
          const rating = row.getValue<number>("rating") ?? 0;
          const full = Math.round(rating);
          return (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < full
                      ? "fill-current text-amber-400"
                      : "stroke-current text-amber-400"
                  }
                  size={14}
                />
              ))}
              <span className="text-muted-foreground ml-1 text-xs">
                {rating.toFixed(1)}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "stock",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Stock" />
        ),
      },
      {
        accessorKey: "availabilityStatus",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const statusRaw = row.original.availabilityStatus ?? "";
          const status = statusRaw.toLowerCase();
          const colorClass = status.includes("out")
            ? "bg-red-100 text-red-700"
            : status.includes("low") || status.includes("limit")
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700";
          return (
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}
            >
              {statusRaw}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Action" />
        ),
        cell: ({ row }) => {
          const product = row.original as Product;
          return (
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => handleEdit(product)}
                className="text-muted-foreground hover:text-primary transition-colors hover:cursor-pointer"
              >
                <SquarePen size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(product.id)}
                className="text-muted-foreground transition-colors hover:cursor-pointer hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
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
    return (
      <div className="p-6 animate-pulse space-y-3">
        {/* table header skeleton */}
        <div className="grid grid-cols-[40px_1fr_80px_100px_60px_100px_60px] gap-4 px-4 py-2">
          <div className="h-4 w-10 bg-muted rounded" />
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="h-4 w-12 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
          <div className="h-4 w-10 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-4 w-8 bg-muted rounded" />
        </div>

        <div className="border rounded-md divide-y divide-muted/50">
          {Array.from({ length: pagination.pageSize }).map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[40px_1fr_80px_100px_60px_100px_60px] items-center gap-4 px-4 py-3"
            >
              <div className="h-10 w-10 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-12 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-4 w-10 bg-muted rounded" />
              <div className="h-6 w-20 bg-muted rounded-full" />
              <div className="flex gap-2">
                <div className="h-4 w-4 bg-muted rounded" />
                <div className="h-4 w-4 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
        <div className="bg-background/60 absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse h-8 w-1/2 rounded-md bg-muted" />
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setEditing(null)}
        >
          <div
            className="bg-background max-h-[90vh] w-full max-w-2xl overflow-auto rounded-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductForm
              defaultValues={editing}
              afterSubmit={() => setEditing(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import type { Product, ProductsListResponse } from "@/types/product";

interface UseProductsParams {
  limit: number;
  skip: number;
  q?: string;
}

export function useProducts({ limit, skip, q }: UseProductsParams) {
  return useQuery<ProductsListResponse, Error>({
    queryKey: ["products", { limit, skip, q }],
    queryFn: async () => {
      if (q) {
        const qs = new URLSearchParams({
          q,
          limit: String(limit),
          skip: String(skip),
        });
        const { data } = await api.get<ProductsListResponse>(
          `/products/search?${qs.toString()}`,
        );
        return data;
      }
      const qs = new URLSearchParams({
        limit: String(limit),
        skip: String(skip),
      });
      const { data } = await api.get<ProductsListResponse>(
        `/products?${qs.toString()}`,
      );
      return data;
    },
  });
}

// helper to normalize id
function cacheKey(id: number | string) {
  return String(id);
}

export function useProduct(id: number | string) {
  const key = cacheKey(id);
  const queryClient = useQueryClient();
  const existing = queryClient.getQueryData<Product>(["product", key]);

  return useQuery<Product, Error>({
    queryKey: ["product", key],
    queryFn: async () => {
      const { data } = await api.get<Product>(`/products/${key}`);
      return data;
    },
    // If we already have this product in cache, skip network call
    enabled: !!id && !existing,
    initialData: existing,
    staleTime: existing ? Infinity : 0,
    retry: false,
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Product>) => {
      const { data } = await api.post<Product>("/products/add", payload);
      return data;
    },
    onSuccess: (newProd) => {
      // Add to cached products lists optimistically
      queryClient.setQueriesData({ queryKey: ["products"], exact: false }, (old) => {
        if (!old) return old;
        if (typeof old === "object" && "products" in old) {
          const list = old as ProductsListResponse;
          return {
            ...list,
            products: [newProd, ...list.products],
            total: list.total + 1,
          };
        }
        return old;
      });

      // Cache detail
      queryClient.setQueryData(["product", cacheKey(newProd.id)], newProd);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number | string; payload: Partial<Product> }) => {
      const { data } = await api.put<Product>(`/products/${id}`, payload);
      // Merge the server response with the payload so we keep any custom fields
      return { ...payload, ...data } as Product;
    },
    onSuccess: async (updated, variables) => {
      // Update individual product cache
      let merged = queryClient.getQueryData<Product>(["product", cacheKey(variables.id)]);
      if (!merged) {
        // fetch full product if not in cache to retain all other fields
        const { data: full } = await api.get<Product>(`/products/${variables.id}`);
        merged = { ...full, ...updated };
      } else {
        merged = { ...merged, ...updated };
      }
      queryClient.setQueryData(["product", cacheKey(variables.id)], merged);

      // Optimistically update any products list caches in memory
      queryClient.setQueriesData({ queryKey: ["products"], exact: false }, (old) => {
        if (!old) return old;
        if (typeof old === "object" && "products" in old) {
          const list = old as ProductsListResponse;
          return {
            ...list,
            products: list.products.map((p) => (p.id === variables.id ? { ...p, ...updated } : p)),
          };
        }
        return old;
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      await api.delete(`/products/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove product detail cache
      queryClient.removeQueries({ queryKey: ["product", cacheKey(deletedId)] });

      // Remove from any cached products list
      queryClient.setQueriesData({ queryKey: ["products"], exact: false }, (old) => {
        if (!old) return old;
        if (typeof old === "object" && "products" in old) {
          const list = old as ProductsListResponse;
          return {
            ...list,
            products: list.products.filter((p) => p.id !== deletedId),
            total: list.total - 1,
          };
        }
        return old;
      });
    },
  });
} 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import type { Product, ProductsListResponse } from "@/types/product";

interface UseProductsParams {
  limit: number;
  skip: number;
}

export function useProducts({ limit, skip }: UseProductsParams) {
  return useQuery<ProductsListResponse, Error>({
    queryKey: ["products", { limit, skip }],
    queryFn: async () => {
      const { data } = await api.get<ProductsListResponse>(
        `/products?limit=${limit}&skip=${skip}`,
      );
      return data;
    }
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
      return data;
    },
    onSuccess: (data) => {
      // Update individual product cache
      queryClient.setQueryData(["product", cacheKey(data.id)], data);

      // Optimistically update any products list caches in memory
      queryClient.setQueriesData({ queryKey: ["products"], exact: false }, (old) => {
        if (!old) return old;
        if (typeof old === "object" && "products" in old) {
          const list = old as ProductsListResponse;
          return {
            ...list,
            products: list.products.map((p) => (p.id === data.id ? data : p)),
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
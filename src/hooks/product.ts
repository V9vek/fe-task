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
    },
    keepPreviousData: true,
  });
}

export function useProduct(id: number | string) {
  return useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await api.get<Product>(`/products/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Product>) => {
      const { data } = await api.post<Product>("/products/add", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.setQueryData(["product", data.id], data);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
} 
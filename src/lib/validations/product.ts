import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  discountPercentage: z.number().min(0).max(100, {
    message: "Discount must be between 0 and 100",
  }),
  rating: z.number().min(0).max(5, {
    message: "Rating must be between 0 and 5",
  }),
  stock: z.number().min(0, { message: "Stock must be a positive number" }),
  brand: z.string().optional(),
  thumbnail: z.string().url({ message: "Thumbnail must be a valid URL" }),
  sku: z.string().min(1, { message: "SKU is required" }),
  weight: z.number().min(0, { message: "Weight must be a positive number" }),
  warrantyInformation: z.string().min(1, {
    message: "Warranty information is required",
  }),
  shippingInformation: z.string().min(1, {
    message: "Shipping information is required",
  }),
  availabilityStatus: z.string().min(1, {
    message: "Availability status is required",
  }),
  returnPolicy: z.string().min(1, { message: "Return policy is required" }),
  minimumOrderQuantity: z
    .number()
    .min(1, { message: "Minimum order quantity must be at least 1" }),
});

export type ProductFormData = z.infer<typeof productSchema>; 
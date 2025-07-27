import type { Metadata } from "next";
import Sidebar from "@/components/sidebar";
import ProductDetail from "@/components/product-detail";
import axios from "axios";
import type { Product } from "@/types/product";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data } = await axios.get<Product>(`https://dummyjson.com/products/${params.id}`);
    return {
      title: `${data.title} – MyShop`,
    };
  } catch {
    return { title: "Product – MyShop" };
  }
}

export default function ProductPage({ params }: Props) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <ProductDetail id={params.id} />
      </div>
    </div>
  );
} 
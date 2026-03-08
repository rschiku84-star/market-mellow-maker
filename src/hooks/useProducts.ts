import { useState } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: "active" | "draft" | "archived";
  images: string[];
  createdAt: Date;
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Handcrafted Ceramic Mug",
    description: "A beautiful handmade ceramic mug perfect for morning coffee.",
    price: 24.99,
    category: "Home & Living",
    status: "active",
    images: [],
    createdAt: new Date("2026-03-01"),
  },
  {
    id: "2",
    name: "Digital Art Print – Sunset",
    description: "High-resolution digital art print of a stunning sunset scene.",
    price: 12.00,
    category: "Digital Art",
    status: "active",
    images: [],
    createdAt: new Date("2026-03-03"),
  },
  {
    id: "3",
    name: "Custom Logo Design Package",
    description: "Professional logo design with 3 concepts and unlimited revisions.",
    price: 149.00,
    category: "Services",
    status: "draft",
    images: [],
    createdAt: new Date("2026-03-05"),
  },
  {
    id: "4",
    name: "Organic Soy Candle Set",
    description: "Set of 3 hand-poured organic soy candles with natural fragrances.",
    price: 34.50,
    category: "Home & Living",
    status: "active",
    images: [],
    createdAt: new Date("2026-03-07"),
  },
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProductStatus = (id: string, status: Product["status"]) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  return { products, addProduct, deleteProduct, updateProductStatus };
}

import { useState, useCallback } from "react";

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
    name: "Premium T-Shirt",
    description: "High-quality cotton t-shirt with modern fit and premium stitching.",
    price: 29.99,
    category: "Fashion",
    status: "active",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
    createdAt: new Date("2026-03-01"),
  },
  {
    id: "2",
    name: "Wireless Headphones",
    description: "Noise-cancelling Bluetooth headphones with 30-hour battery life.",
    price: 89.99,
    category: "Electronics",
    status: "active",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
    createdAt: new Date("2026-03-02"),
  },
  {
    id: "3",
    name: "Smart Watch",
    description: "Fitness tracker with heart rate monitor, GPS, and water resistance.",
    price: 199.99,
    category: "Gadgets",
    status: "active",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
    createdAt: new Date("2026-03-03"),
  },
  {
    id: "4",
    name: "Artisan Leather Wallet",
    description: "Premium handcrafted leather wallet with RFID blocking and 8 card slots.",
    price: 59.99,
    category: "Fashion",
    status: "active",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=500"],
    createdAt: new Date("2026-03-04"),
  },
  {
    id: "5",
    name: "Portable Speaker",
    description: "Waterproof Bluetooth speaker with deep bass and 12-hour playtime.",
    price: 49.99,
    category: "Electronics",
    status: "draft",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"],
    createdAt: new Date("2026-03-05"),
  },
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [loading] = useState(false);

  const addProduct = useCallback(async (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateProductStatus = useCallback(async (id: string, status: Product["status"]) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }, []);

  const updateProduct = useCallback(async (id: string, product: Partial<Omit<Product, "id" | "createdAt">>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...product } : p)));
    return true;
  }, []);

  return { products, loading, addProduct, deleteProduct, updateProductStatus, updateProduct };
}

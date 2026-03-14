import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  offerAmount?: number | null;
  category: string;
  status: "active" | "draft" | "archived";
  images: string[];
  whatsappNumber?: string;
  createdAt: Date;
}

export function useProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!user) { setProducts([]); setLoading(false); return; }
    setLoading(true);
const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setProducts(data.map((p) => ({ id: p.id, name: p.name, description: p.description ?? "", price: Number(p.price), offerAmount: p.offer_amount ? Number(p.offer_amount) : null, category: p.category, status: p.status as Product["status"], images: p.images ?? [], whatsappNumber: (p as any).whatsapp_number ?? "", createdAt: new Date(p.created_at) })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
    if (!user) return null;
    const { data, error } = await supabase.from("products").insert({ user_id: user.id, name: product.name, description: product.description, price: product.price, offer_amount: product.offerAmount, category: product.category, status: product.status, images: product.images }).select().single();
    if (!error && data) { await fetchProducts(); return data; }
    return null;
  };

  const deleteProduct = async (id: string) => { await supabase.from("products").delete().eq("id", id); await fetchProducts(); };
  const updateProductStatus = async (id: string, status: Product["status"]) => { await supabase.from("products").update({ status }).eq("id", id); await fetchProducts(); };
const updateProduct = async (id: string, product: Partial<Omit<Product, "id" | "createdAt">>) => {
    const { error } = await supabase.from("products").update({ name: product.name, description: product.description, price: product.price, offer_amount: product.offerAmount, category: product.category, status: product.status, images: product.images }).eq("id", id);
    if (!error) await fetchProducts();
    return !error;
  };

  return { products, loading, addProduct, deleteProduct, updateProductStatus, updateProduct };
}

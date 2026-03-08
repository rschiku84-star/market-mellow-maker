import { createContext, useContext, ReactNode } from "react";
import { useProducts, Product } from "@/hooks/useProducts";

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<unknown>;
  deleteProduct: (id: string) => Promise<void>;
  updateProductStatus: (id: string, status: Product["status"]) => Promise<void>;
  updateProduct: (id: string, product: Partial<Omit<Product, "id" | "createdAt">>) => Promise<boolean>;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export const useProductsContext = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProductsContext must be used within ProductsProvider");
  return ctx;
};

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const value = useProducts();
  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

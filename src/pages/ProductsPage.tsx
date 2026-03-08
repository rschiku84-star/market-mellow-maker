import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProductGrid from "@/components/dashboard/ProductGrid";
import { Button } from "@/components/ui/button";
import { useProductsContext } from "@/contexts/ProductsContext";

const ProductsPage = () => {
  const { products, deleteProduct, updateProductStatus } = useProductsContext();
  const navigate = useNavigate();

  return (
    <>
      <DashboardHeader
        title="Products"
        subtitle={`${products.length} products in your store`}
      />
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => navigate("/dashboard/products/new")}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
        <ProductGrid
          products={products}
          onDelete={deleteProduct}
          onStatusChange={updateProductStatus}
        />
      </div>
    </>
  );
};

export default ProductsPage;

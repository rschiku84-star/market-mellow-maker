import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProductUploadForm from "@/components/dashboard/ProductUploadForm";
import { useProductsContext } from "@/contexts/ProductsContext";
import { Card, CardContent } from "@/components/ui/card";

const NewProductPage = () => {
  const { addProduct } = useProductsContext();
  const navigate = useNavigate();

  return (
    <>
      <DashboardHeader
        title="Add New Product"
        subtitle="Upload images and fill in product details"
      />
      <div className="p-6 max-w-3xl">
        <Card>
          <CardContent className="p-6">
            <ProductUploadForm
              onSubmit={async (product) => {
                await addProduct(product);
                navigate("/dashboard/products");
              }}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default NewProductPage;

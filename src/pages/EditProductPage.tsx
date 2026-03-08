import { useNavigate, useParams } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProductUploadForm from "@/components/dashboard/ProductUploadForm";
import { useProductsContext } from "@/contexts/ProductsContext";
import { Card, CardContent } from "@/components/ui/card";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products, updateProduct } = useProductsContext();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <>
        <DashboardHeader title="Edit Product" subtitle="Product not found" />
        <div className="p-6 text-muted-foreground">
          This product doesn't exist or has been deleted.
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Edit Product"
        subtitle={`Editing "${product.name}"`}
      />
      <div className="p-6 max-w-3xl">
        <Card>
          <CardContent className="p-6">
            <ProductUploadForm
              initialData={product}
              onSubmit={async (data) => {
                await updateProduct(product.id, data);
                navigate("/dashboard/products");
              }}
              submitLabel="Update Product"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EditProductPage;

import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { ProductsProvider } from "@/contexts/ProductsContext";

const Dashboard = () => {
  return (
    <ProductsProvider>
      <div className="flex min-h-screen bg-background">
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>
        <main className="flex-1 flex flex-col min-h-screen overflow-auto">
          <Outlet />
        </main>
      </div>
    </ProductsProvider>
  );
};

export default Dashboard;

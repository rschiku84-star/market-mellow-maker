import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ProductsProvider>
      <div className="flex min-h-screen bg-background">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="relative z-10 h-full w-64">
              <DashboardSidebar />
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col min-h-screen overflow-auto">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center p-3 border-b border-border bg-card">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <span className="ml-2 font-display font-bold text-foreground">CreatorHub</span>
          </div>
          <Outlet />
        </main>
      </div>
    </ProductsProvider>
  );
};

export default Dashboard;

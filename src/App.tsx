import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DashboardOverview from "./pages/DashboardOverview";
import ProductsPage from "./pages/ProductsPage";
import NewProductPage from "./pages/NewProductPage";
import EditProductPage from "./pages/EditProductPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import StorefrontPage from "./pages/StorefrontPage";
import AIStudioPage from "./pages/AIStudioPage";
import MyVideosPage from "./pages/MyVideosPage";
import ImageToReelPage from "./pages/ImageToReelPage";
import ScriptToVideoPage from "./pages/ScriptToVideoPage";
import ProductAdPage from "./pages/ProductAdPage";
import SocialMediaPage from "./pages/SocialMediaPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import PublicProductsPage from "./pages/PublicProductsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<PublicProductsPage />} />
            <Route path="/storefront" element={<StorefrontPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/new" element={<NewProductPage />} />
              <Route path="products/:id/edit" element={<EditProductPage />} />
              <Route path="ai-studio" element={<AIStudioPage />} />
              <Route path="my-videos" element={<MyVideosPage />} />
              <Route path="image-to-reel" element={<ImageToReelPage />} />
              <Route path="script-to-video" element={<ScriptToVideoPage />} />
              <Route path="product-ad" element={<ProductAdPage />} />
              <Route path="social" element={<SocialMediaPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import Dashboard from "@/pages/Dashboard";
import DashboardOverview from "@/pages/DashboardOverview";
import ProductsPage from "@/pages/ProductsPage";
import NewProductPage from "@/pages/NewProductPage";
import EditProductPage from "@/pages/EditProductPage";
import VideoGeneratorPage from "@/pages/VideoGeneratorPage";
import ViralIdeasPage from "@/pages/ViralIdeasPage";
import HookGeneratorPage from "@/pages/HookGeneratorPage";
import CaptionGeneratorPage from "@/pages/CaptionGeneratorPage";
import ScriptConverterPage from "@/pages/ScriptConverterPage";
import TikTokIdeasPage from "@/pages/TikTokIdeasPage";
import FacelessYouTubePage from "@/pages/FacelessYouTubePage";
import ThumbnailIdeasPage from "@/pages/ThumbnailIdeasPage";
import ReelCreatorPage from "@/pages/ReelCreatorPage";
import ContentRepurposerPage from "@/pages/ContentRepurposerPage";
import TrendingTopicsPage from "@/pages/TrendingTopicsPage";
import ContentCalendarPage from "@/pages/ContentCalendarPage";
import ViralHookLibraryPage from "@/pages/ViralHookLibraryPage";
import MyContentPage from "@/pages/MyContentPage";
import MyVideosPage from "@/pages/MyVideosPage";
import SettingsPage from "@/pages/SettingsPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import StorefrontPage from "@/pages/StorefrontPage";
import PublicProductsPage from "@/pages/PublicProductsPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsPage from "@/pages/TermsPage";
import AIStudioPage from "@/pages/AIStudioPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SocialMediaPage from "@/pages/SocialMediaPage";
import ImageToReelPage from "@/pages/ImageToReelPage";
import ScriptToVideoPage from "@/pages/ScriptToVideoPage";
import ProductAdPage from "@/pages/ProductAdPage";
import ShopCatalogPage from "@/pages/ShopCatalogPage";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/storefront" element={<StorefrontPage />} />
          <Route path="/products" element={<PublicProductsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />

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
            <Route path="shop-catalog" element={<ShopCatalogPage />} />
            <Route path="video-generator" element={<VideoGeneratorPage />} />
            <Route path="viral-ideas" element={<ViralIdeasPage />} />
            <Route path="hook-generator" element={<HookGeneratorPage />} />
            <Route path="caption-generator" element={<CaptionGeneratorPage />} />
            <Route path="script-converter" element={<ScriptConverterPage />} />
            <Route path="tiktok-ideas" element={<TikTokIdeasPage />} />
            <Route path="faceless-youtube" element={<FacelessYouTubePage />} />
            <Route path="thumbnail-ideas" element={<ThumbnailIdeasPage />} />
            <Route path="reel-creator" element={<ReelCreatorPage />} />
            <Route path="content-repurposer" element={<ContentRepurposerPage />} />
            <Route path="trending-topics" element={<TrendingTopicsPage />} />
            <Route path="content-calendar" element={<ContentCalendarPage />} />
            <Route path="viral-hooks" element={<ViralHookLibraryPage />} />
            <Route path="my-content" element={<MyContentPage />} />
            <Route path="my-videos" element={<MyVideosPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="ai-studio" element={<AIStudioPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="social-media" element={<SocialMediaPage />} />
            <Route path="image-to-reel" element={<ImageToReelPage />} />
            <Route path="script-to-video" element={<ScriptToVideoPage />} />
            <Route path="product-ad" element={<ProductAdPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

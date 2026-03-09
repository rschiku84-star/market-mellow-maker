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
import SubscriptionPage from "./pages/SubscriptionPage";
import NotFound from "./pages/NotFound";
import PublicProductsPage from "./pages/PublicProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";

// New AI tools
import VideoGeneratorPage from "./pages/VideoGeneratorPage";
import ViralIdeasPage from "./pages/ViralIdeasPage";
import HookGeneratorPage from "./pages/HookGeneratorPage";
import CaptionGeneratorPage from "./pages/CaptionGeneratorPage";
import ScriptConverterPage from "./pages/ScriptConverterPage";
import TikTokIdeasPage from "./pages/TikTokIdeasPage";
import FacelessYouTubePage from "./pages/FacelessYouTubePage";
import ThumbnailIdeasPage from "./pages/ThumbnailIdeasPage";
import ReelCreatorPage from "./pages/ReelCreatorPage";
import ContentRepurposerPage from "./pages/ContentRepurposerPage";
import TrendingTopicsPage from "./pages/TrendingTopicsPage";
import ContentCalendarPage from "./pages/ContentCalendarPage";
import ViralHookLibraryPage from "./pages/ViralHookLibraryPage";
import MyContentPage from "./pages/MyContentPage";

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
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
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
              <Route path="subscription" element={<SubscriptionPage />} />
              {/* AI Tools */}
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
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

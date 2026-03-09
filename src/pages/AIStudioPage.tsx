import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Megaphone,
  FileText,
  Share2,
  Mail,
  Copy,
  Check,
  Loader2,
  Video,
  Download,
  MessageCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductsContext } from "@/contexts/ProductsContext";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/hooks/useProducts";

const CONTENT_TYPES = [
  { id: "ad-copy", label: "Ad Copy", icon: Megaphone, description: "Facebook & Google ad headlines + body" },
  { id: "product-description", label: "Product Description", icon: FileText, description: "SEO-friendly listing copy" },
  { id: "social-caption", label: "Social Captions", icon: Share2, description: "Instagram, TikTok & Facebook posts" },
  { id: "email-campaign", label: "Email Campaign", icon: Mail, description: "Promotional email with subject line" },
];

const CONTENT_STREAM_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`;
const VIDEO_STREAM_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-video-script`;

export default function AIStudioPage() {
  const { products } = useProductsContext();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedType, setSelectedType] = useState("ad-copy");
  const [output, setOutput] = useState("");
  const [videoScript, setVideoScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedVideo, setCopiedVideo] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const streamFromEdge = async (url: string, body: object, onChunk: (text: string) => void) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      toast({ title: "Not authenticated", description: "Please log in first.", variant: "destructive" });
      return;
    }

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Generation failed" }));
      toast({ title: "Error", description: err.error, variant: "destructive" });
      return;
    }

    if (!resp.body) throw new Error("No response body");
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) { fullText += content; onChunk(fullText); }
        } catch { buffer = line + "\n" + buffer; break; }
      }
    }
  };

  const handleGenerateContent = async () => {
    if (!selectedProduct) { toast({ title: "Select a product", variant: "destructive" }); return; }
    setIsGenerating(true);
    setOutput("");
    try {
      await streamFromEdge(CONTENT_STREAM_URL, {
        product: { name: selectedProduct.name, description: selectedProduct.description, price: selectedProduct.price, category: selectedProduct.category },
        type: selectedType,
      }, setOutput);
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to generate content.", variant: "destructive" });
    } finally { setIsGenerating(false); }
  };

  const handleGenerateVideoScript = async () => {
    if (!selectedProduct) { toast({ title: "Select a product", variant: "destructive" }); return; }
    setIsGeneratingVideo(true);
    setVideoScript("");
    try {
      await streamFromEdge(VIDEO_STREAM_URL, {
        product: {
          name: selectedProduct.name,
          description: selectedProduct.description,
          price: selectedProduct.price,
          offerAmount: selectedProduct.offerAmount,
          category: selectedProduct.category,
        },
      }, setVideoScript);
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to generate video script.", variant: "destructive" });
    } finally { setIsGeneratingVideo(false); }
  };

  const handleCopy = async (text: string, setter: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
    toast({ title: "Copied!" });
  };

  const handleDownloadVideo = () => {
    const link = document.createElement("a");
    link.href = "/sample-marketing-reel.mp4";
    link.download = `${selectedProduct?.name || "marketing"}-reel.mp4`;
    link.click();
    toast({ title: "Downloading video…" });
  };

  const handleShareWhatsApp = () => {
    const text = videoScript
      ? `Check out ${selectedProduct?.name}! 🔥\n\n${videoScript.slice(0, 500)}`
      : `Check out ${selectedProduct?.name}! Only $${selectedProduct?.price}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareInstagram = () => {
    toast({
      title: "Share to Instagram",
      description: "Download the video first, then share it from your gallery to Instagram Reels.",
    });
    handleDownloadVideo();
  };

  const ProductSelector = () => (
    <div>
      <label className="text-sm font-semibold text-foreground mb-1.5 block">Select Product</label>
      <Select value={selectedProductId} onValueChange={setSelectedProductId}>
        <SelectTrigger><SelectValue placeholder="Choose a product…" /></SelectTrigger>
        <SelectContent>
          {products.length === 0 ? (
            <SelectItem value="none" disabled>No products yet</SelectItem>
          ) : (
            products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name} — ${p.price.toFixed(2)}
                {p.offerAmount ? ` (💰 $${p.offerAmount} off)` : ""}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <>
      <DashboardHeader title="AI Studio" subtitle="Generate marketing content & video reels from your product data" />
      <div className="p-6 space-y-6 max-w-4xl">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content"><Sparkles className="w-4 h-4 mr-2" /> Content</TabsTrigger>
            <TabsTrigger value="video"><Video className="w-4 h-4 mr-2" /> Video Reel</TabsTrigger>
          </TabsList>

          {/* CONTENT TAB */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-5">
                <ProductSelector />
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Content Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {CONTENT_TYPES.map((ct) => (
                      <button key={ct.id} onClick={() => setSelectedType(ct.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${selectedType === ct.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"}`}>
                        <ct.icon className="w-5 h-5" />
                        <span className="text-xs font-semibold">{ct.label}</span>
                        <span className="text-[10px] leading-tight opacity-70">{ct.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleGenerateContent} disabled={isGenerating || !selectedProductId} className="w-full">
                  {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4 mr-2" /> Generate Content</>}
                </Button>
              </CardContent>
            </Card>
            <AnimatePresence>
              {(output || isGenerating) && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-semibold text-foreground">Generated Content</h3>
                        <div className="flex gap-2">
                          {output && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleCopy(output, setCopied)}>
                                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                                {copied ? "Copied" : "Copy"}
                              </Button>
                              <Button variant="outline" size="sm" onClick={handleShareWhatsApp}>
                                <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="prose prose-sm max-w-none text-foreground">
                        {output ? <ReactMarkdown>{output}</ReactMarkdown> : (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Generating…</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* VIDEO REEL TAB */}
          <TabsContent value="video" className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-5">
                <ProductSelector />

                {/* Video Preview */}
                <div className="rounded-xl overflow-hidden border border-border bg-black aspect-[9/16] max-h-[480px] mx-auto">
                  <video src="/sample-marketing-reel.mp4" controls loop muted playsInline className="w-full h-full object-contain" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button onClick={handleGenerateVideoScript} disabled={isGeneratingVideo || !selectedProductId} className="w-full">
                    {isGeneratingVideo ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Script…</> : <><Video className="w-4 h-4 mr-2" /> Generate Reel Script</>}
                  </Button>
                  <Button variant="outline" onClick={handleDownloadVideo} disabled={!selectedProductId} className="w-full">
                    <Download className="w-4 h-4 mr-2" /> Download Reel
                  </Button>
                </div>

                {/* Share Buttons */}
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={handleShareInstagram} disabled={!selectedProductId}>
                    <Share2 className="w-4 h-4 mr-2" /> Share to Instagram
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={handleShareWhatsApp} disabled={!selectedProductId}>
                    <MessageCircle className="w-4 h-4 mr-2" /> Share to WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Video Script Output */}
            <AnimatePresence>
              {(videoScript || isGeneratingVideo) && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-semibold text-foreground">🎬 Reel Script</h3>
                        {videoScript && (
                          <Button variant="outline" size="sm" onClick={() => handleCopy(videoScript, setCopiedVideo)}>
                            {copiedVideo ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                            {copiedVideo ? "Copied" : "Copy Script"}
                          </Button>
                        )}
                      </div>
                      <div className="prose prose-sm max-w-none text-foreground">
                        {videoScript ? <ReactMarkdown>{videoScript}</ReactMarkdown> : (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Generating script…</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

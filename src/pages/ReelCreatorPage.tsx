import { useState } from "react";
import { Instagram, Package, Loader2, Copy, Download, Sparkles, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import { useProductsContext } from "@/contexts/ProductsContext";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReelCreatorPage = () => {
  const [input, setInput] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const { output, isGenerating, generate, credits } = useAIGeneration();
  const { products } = useProductsContext();
  const navigate = useNavigate();

  const activeProducts = products.filter((p) => p.status === "active");

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    if (productId === "none") {
      setInput("");
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (product) {
      let prompt = `Create an Instagram reel for "${product.name}"`;
      prompt += `\nPrice: ₹${product.price}`;
      if (product.offerAmount) prompt += `\nOffer Price: ₹${product.offerAmount}`;
      if (product.description) prompt += `\nDescription: ${product.description}`;
      setInput(prompt);
    }
  };

  const handleGenerate = () => {
    if (!input.trim()) {
      toast({ title: "Please enter some text or select a product", variant: "destructive" });
      return;
    }
    generate("reel-creator", input.trim());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied to clipboard!" });
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reel-creator-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <DashboardHeader title="Instagram Reel Creator" subtitle="Generate reel ideas, hooks, captions, and hashtags" />
      <div className="p-4 md:p-6 max-w-4xl space-y-6">
        {/* Credits */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          {credits.loading ? "Loading credits..." : credits.limit !== null ? (
            <span>{credits.remaining} / {credits.limit} credits remaining today</span>
          ) : (
            <span>Unlimited credits ({credits.plan} plan)</span>
          )}
        </div>

        {/* Product selector */}
        {activeProducts.length > 0 && (
          <Card>
            <CardContent className="p-5 space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                Select a product from your catalog (optional)
              </label>
              <Select value={selectedProductId} onValueChange={handleProductSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product to auto-fill..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None - enter manually</SelectItem>
                  {activeProducts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <span className="flex items-center gap-2">
                        {p.images.length > 0 && (
                          <img src={p.images[0]} alt="" className="w-5 h-5 rounded object-cover" />
                        )}
                        {p.name} — ₹{p.price}
                        {p.offerAmount ? ` (Offer: ₹${p.offerAmount})` : ""}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Input */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <label className="text-sm font-medium text-foreground">Enter your reel topic</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Skincare routine, Budget meal prep, Side hustle ideas..."
              rows={4}
              maxLength={2000}
              disabled={isGenerating}
            />
            <div className="flex items-center gap-3">
              <Button onClick={handleGenerate} disabled={isGenerating || !credits.canGenerate} className="gap-2">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Instagram className="w-4 h-4" />
                    Generate
                  </>
                )}
              </Button>
              {!credits.canGenerate && (
                <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/subscription")} className="gap-1 text-destructive">
                  <AlertTriangle className="w-3 h-3" /> Upgrade Plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {isGenerating && !output && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-12 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">AI is crafting your reel content...</p>
          </motion.div>
        )}

        {/* Output */}
        {output && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Generated Content</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1">
                      <Copy className="w-3 h-3" /> Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1">
                      <Download className="w-3 h-3" /> Download
                    </Button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none text-foreground [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-foreground [&_strong]:text-foreground [&_li]:text-muted-foreground [&_p]:text-muted-foreground">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ReelCreatorPage;

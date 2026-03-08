import { useState } from "react";
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
import { useProductsContext } from "@/contexts/ProductsContext";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/hooks/useProducts";

const CONTENT_TYPES = [
  { id: "ad-copy", label: "Ad Copy", icon: Megaphone, description: "Facebook & Google ad headlines + body" },
  { id: "product-description", label: "Product Description", icon: FileText, description: "SEO-friendly listing copy" },
  { id: "social-caption", label: "Social Captions", icon: Share2, description: "Instagram, TikTok & Facebook posts" },
  { id: "email-campaign", label: "Email Campaign", icon: Mail, description: "Promotional email with subject line" },
];

const STREAM_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`;

const AIStudioPage = () => {
  const { products } = useProductsContext();
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("ad-copy");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleGenerate = async () => {
    if (!selectedProduct) {
      toast({ title: "Select a product", description: "Choose a product to generate content for.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setOutput("");

    try {
      const resp = await fetch(STREAM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          product: {
            name: selectedProduct.name,
            description: selectedProduct.description,
            price: selectedProduct.price,
            category: selectedProduct.category,
          },
          type: selectedType,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Generation failed" }));
        toast({ title: "Error", description: err.error, variant: "destructive" });
        setIsGenerating(false);
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
            if (content) {
              fullText += content;
              setOutput(fullText);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to generate content.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Content copied to clipboard." });
  };

  return (
    <>
      <DashboardHeader
        title="AI Studio"
        subtitle="Generate marketing content from your product data"
      />
      <div className="p-6 space-y-6 max-w-4xl">
        {/* Controls */}
        <Card>
          <CardContent className="p-6 space-y-5">
            {/* Product Selector */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
                Select Product
              </label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product…" />
                </SelectTrigger>
                <SelectContent>
                  {products.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No products yet — add one first
                    </SelectItem>
                  ) : (
                    products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — ${p.price.toFixed(2)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Content Type Grid */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Content Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CONTENT_TYPES.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => setSelectedType(ct.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                      selectedType === ct.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ct.icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{ct.label}</span>
                    <span className="text-[10px] leading-tight opacity-70">
                      {ct.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedProductId}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <AnimatePresence>
          {(output || isGenerating) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold text-foreground">
                      Generated Content
                    </h3>
                    {output && (
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        {copied ? (
                          <Check className="w-4 h-4 mr-1" />
                        ) : (
                          <Copy className="w-4 h-4 mr-1" />
                        )}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    )}
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground">
                    {output ? (
                      <ReactMarkdown>{output}</ReactMarkdown>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Generating…</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AIStudioPage;

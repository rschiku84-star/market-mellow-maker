import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Loader2,
  Sparkles,
  Lock,
  Play,
  Tag,
  Percent,
  Clock,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useVideoLimit } from "@/hooks/useVideoLimit";
import { useProductsContext } from "@/contexts/ProductsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AD_GOALS = [
  { id: "sales", label: "🛒 Drive Sales", desc: "Urgency + discount focus" },
  { id: "awareness", label: "📣 Brand Awareness", desc: "Story + lifestyle focus" },
  { id: "launch", label: "🚀 Product Launch", desc: "Excitement + novelty focus" },
  { id: "reviews", label: "⭐ Social Proof", desc: "Testimonials + trust focus" },
];

export default function ProductAdPage() {
  const { user } = useAuth();
  const limit = useVideoLimit();
  const { products } = useProductsContext();

  const [selectedProductId, setSelectedProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [hasOffer, setHasOffer] = useState(false);
  const [hasUrgency, setHasUrgency] = useState(false);
  const [urgencyText, setUrgencyText] = useState("Limited time offer!");
  const [adGoal, setAdGoal] = useState("sales");
  const [extraNotes, setExtraNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    const product = products.find((p) => p.id === productId);
    if (product) {
      setProductName(product.name);
      setPrice(product.price.toString());
      if (product.offerAmount) {
        setOfferAmount(product.offerAmount.toString());
        setHasOffer(true);
      }
    }
  };

  const finalPrice = hasOffer && offerAmount
    ? (parseFloat(price || "0") - parseFloat(offerAmount || "0")).toFixed(2)
    : null;

  const handleGenerate = async () => {
    if (!productName.trim()) {
      toast({ title: "Enter a product name", variant: "destructive" });
      return;
    }
    if (!limit.canGenerate) {
      toast({
        title: "Daily limit reached",
        description: "Free plan: 3 reels/day. Upgrade to Pro for unlimited.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setGeneratedVideoUrl(null);

    await new Promise((r) => setTimeout(r, 3200));

    const mockVideoUrl = "/sample-marketing-reel.mp4";

    const scriptSummary = [
      `Goal: ${adGoal}`,
      `Product: ${productName}`,
      price ? `Price: $${price}` : "",
      hasOffer && offerAmount ? `Offer: $${offerAmount} off → $${finalPrice}` : "",
      hasUrgency ? `Urgency: ${urgencyText}` : "",
      extraNotes ? `Notes: ${extraNotes}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    if (user) {
      const { error } = await supabase.from("generated_videos").insert({
        user_id: user.id,
        product_id: selectedProductId || null,
        product_name: productName,
        script: scriptSummary,
        video_url: mockVideoUrl,
      });
      if (error) {
        console.error(error);
        toast({ title: "Error saving ad video", variant: "destructive" });
      } else {
        await limit.refresh();
        toast({ title: "✅ Ad video generated & saved to My Videos!" });
      }
    }

    setGeneratedVideoUrl(mockVideoUrl);
    setGenerating(false);
  };

  const usagePercent = limit.dailyLimit
    ? Math.min((limit.todayCount / limit.dailyLimit) * 100, 100)
    : 0;

  return (
    <>
      <DashboardHeader
        title="Product Ad Generator"
        subtitle="Create high-converting promotional video ads from your product details"
      />
      <div className="p-6 max-w-5xl space-y-6">
        {/* Usage Badge */}
        {!limit.loading && (
          <div className="flex items-center gap-3">
            <Badge variant={limit.canGenerate ? "secondary" : "destructive"}>
              {limit.plan === "free"
                ? `${limit.todayCount} / ${limit.dailyLimit} ads today`
                : "Pro — Unlimited"}
            </Badge>
            {limit.plan === "free" && (
              <div className="flex-1 max-w-xs h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardContent className="p-6 space-y-5">
              {/* Quick fill from existing product */}
              {products.length > 0 && (
                <div className="space-y-1">
                  <Label>Quick fill from existing product</Label>
                  <Select value={selectedProductId} onValueChange={handleSelectProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product (optional)…" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} — ${p.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="adProductName" className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" /> Product Name
                </Label>
                <Input
                  id="adProductName"
                  placeholder="e.g. Glow Serum Pro"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="adPrice" className="flex items-center gap-2">
                  <Percent className="w-3.5 h-3.5" /> Price ($)
                </Label>
                <Input
                  id="adPrice"
                  type="number"
                  placeholder="29.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Offer Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Percent className="w-3.5 h-3.5" /> Include Special Offer
                  </Label>
                  <Switch checked={hasOffer} onCheckedChange={setHasOffer} />
                </div>
                {hasOffer && (
                  <div className="space-y-2 pl-1">
                    <Input
                      type="number"
                      placeholder="Discount amount (e.g. 5)"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                    />
                    {finalPrice && price && (
                      <p className="text-xs text-primary font-semibold">
                        Final price: ${finalPrice} (saving ${offerAmount})
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Urgency Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Add Urgency Text
                  </Label>
                  <Switch checked={hasUrgency} onCheckedChange={setHasUrgency} />
                </div>
                {hasUrgency && (
                  <Input
                    placeholder="e.g. Only 48 hours left!"
                    value={urgencyText}
                    onChange={(e) => setUrgencyText(e.target.value)}
                  />
                )}
              </div>

              {/* Ad Goal */}
              <div className="space-y-2">
                <Label>Ad Goal</Label>
                <div className="grid grid-cols-2 gap-2">
                  {AD_GOALS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setAdGoal(g.id)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        adGoal === g.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="text-xs font-semibold text-foreground">{g.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{g.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="extraNotes">Extra Notes (optional)</Label>
                <Textarea
                  id="extraNotes"
                  placeholder="e.g. Target audience: women 25-40, mention free shipping"
                  rows={2}
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !limit.canGenerate}
                className="w-full"
                size="lg"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Ad…</>
                ) : !limit.canGenerate ? (
                  <><Lock className="w-4 h-4 mr-2" /> Limit Reached — Upgrade to Pro</>
                ) : (
                  <><Megaphone className="w-4 h-4 mr-2" /> Generate Ad Video</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col">
              <h3 className="font-display font-semibold text-foreground mb-4">Ad Preview</h3>
              <div className="flex-1 flex items-center justify-center min-h-[300px]">
                <AnimatePresence mode="wait">
                  {generating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-4"
                    >
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Megaphone className="w-8 h-8 text-primary animate-pulse" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Crafting your ad…</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Composing visuals, text overlays & music
                        </p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        {["Writing hook…", "Adding visuals…", "Mixing audio…"].map(
                          (step, i) => (
                            <motion.span
                              key={step}
                              className="text-[10px] bg-muted px-2 py-1 rounded-full text-muted-foreground"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.5,
                              }}
                            >
                              {step}
                            </motion.span>
                          )
                        )}
                      </div>
                    </motion.div>
                  ) : generatedVideoUrl ? (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full"
                    >
                      <div className="rounded-xl overflow-hidden border border-border bg-black aspect-[9/16] max-h-[480px] mx-auto">
                        <video
                          src={generatedVideoUrl}
                          controls
                          loop
                          muted
                          playsInline
                          autoPlay
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-center text-xs text-muted-foreground mt-3">
                        Saved to My Videos ✓
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center space-y-3"
                    >
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center">
                        <Play className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your ad video will appear here
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  ImageIcon,
  Video,
  Loader2,
  Sparkles,
  Lock,
  Play,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useVideoLimit } from "@/hooks/useVideoLimit";

const STYLES = [
  { id: "cinematic", label: "🎬 Cinematic", desc: "Dark, moody, high contrast" },
  { id: "bright", label: "☀️ Bright & Airy", desc: "Clean, minimal, lifestyle" },
  { id: "bold", label: "🔥 Bold & Energetic", desc: "Vibrant, fast-paced, trending" },
  { id: "luxury", label: "💎 Luxury", desc: "Premium, elegant, refined" },
];

export default function ImageToReelPage() {
  const { user } = useAuth();
  const limit = useVideoLimit();

  const [productName, setProductName] = useState("");
  const [caption, setCaption] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      toast({ title: "Upload an image first", variant: "destructive" });
      return;
    }
    if (!productName.trim()) {
      toast({ title: "Enter a product name", variant: "destructive" });
      return;
    }
    if (!limit.canGenerate) {
      toast({
        title: "Daily limit reached",
        description: `Free plan: 3 reels/day. Upgrade to Pro for unlimited.`,
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setGeneratedVideoUrl(null);

    // Simulate generation delay (mock)
    await new Promise((r) => setTimeout(r, 2800));

    const mockVideoUrl = "/sample-marketing-reel.mp4";

    // Save to database
    if (user) {
      const { error } = await supabase.from("generated_videos").insert({
        user_id: user.id,
        product_name: productName,
        script: `Style: ${style}. Caption: ${caption || "No caption"}`,
        video_url: mockVideoUrl,
      });
      if (error) {
        console.error(error);
        toast({ title: "Error saving video", variant: "destructive" });
      } else {
        await limit.refresh();
        toast({ title: "✅ Reel generated & saved to My Videos!" });
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
        title="Image to Reel"
        subtitle="Transform your product photo into a stunning 9:16 marketing reel"
      />
      <div className="p-6 max-w-5xl space-y-6">
        {/* Usage Badge */}
        {!limit.loading && (
          <div className="flex items-center gap-3">
            <Badge variant={limit.canGenerate ? "secondary" : "destructive"}>
              {limit.plan === "free"
                ? `${limit.todayCount} / ${limit.dailyLimit} reels today`
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
              <h3 className="font-display font-semibold text-foreground">1. Upload Product Image</h3>

              {/* Dropzone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  imagePreview ? "border-primary/40 bg-primary/5 p-0 overflow-hidden aspect-[9/16] max-h-64" : "border-border hover:border-primary/50 bg-muted/30 py-12"
                }`}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium">Click to change</p>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">Drop your product image</p>
                      <p className="text-xs text-muted-foreground mt-1">9:16 works best • JPG, PNG, WEBP</p>
                    </div>
                    <Button size="sm" variant="outline" type="button">
                      <Upload className="w-4 h-4 mr-2" /> Browse File
                    </Button>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <div className="space-y-1">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  placeholder="e.g. Rose Gold Wireless Earbuds"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="caption">Caption / Tagline (optional)</Label>
                <Textarea
                  id="caption"
                  placeholder="e.g. Sound that moves you ✨"
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label>Visual Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        style === s.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="text-xs font-semibold text-foreground">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !limit.canGenerate}
                className="w-full"
                size="lg"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Reel…</>
                ) : !limit.canGenerate ? (
                  <><Lock className="w-4 h-4 mr-2" /> Limit Reached — Upgrade to Pro</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Generate Reel</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col">
              <h3 className="font-display font-semibold text-foreground mb-4">2. Preview</h3>
              <div className="flex-1 flex items-center justify-center">
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
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Crafting your reel…</p>
                        <p className="text-sm text-muted-foreground mt-1">AI is composing transitions & effects</p>
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
                        Your generated reel will appear here
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

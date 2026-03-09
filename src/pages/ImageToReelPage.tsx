import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  ImageIcon,
  Loader2,
  Sparkles,
  Lock,
  Play,
  Zap,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useVideoLimit } from "@/hooks/useVideoLimit";

const MOTION_TYPES = [
  { id: "zoom", label: "🔍 Zoom & Pan", desc: "Smooth camera movement" },
  { id: "parallax", label: "🌊 Parallax", desc: "Depth-based animation" },
  { id: "morph", label: "🔮 Morph", desc: "Fluid shape transitions" },
  { id: "burst", label: "💥 Burst", desc: "Dynamic particle effects" },
];

export default function ImageToReelPage() {
  const { user } = useAuth();
  const limit = useVideoLimit();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [motionType, setMotionType] = useState("zoom");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
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
    if (!limit.canGenerate) {
      toast({
        title: "Daily limit reached",
        description: "Free plan: 3 videos/day. Upgrade to Pro for unlimited.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setGeneratedVideoUrl(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 18));
    }, 400);

    await new Promise((r) => setTimeout(r, 3000));
    clearInterval(progressInterval);
    setProgress(100);

    const mockVideoUrl = "/sample-marketing-reel.mp4";

    if (user) {
      const { error } = await supabase.from("generated_videos").insert({
        user_id: user.id,
        product_name: `Image Video: ${imageFile.name}`,
        script: `Motion: ${motionType}`,
        video_url: mockVideoUrl,
      });
      if (error) {
        console.error(error);
        toast({ title: "Error saving video", variant: "destructive" });
      } else {
        await limit.refresh();
        toast({ title: "✅ Animated video generated & saved!" });
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
        title="Image to Video"
        subtitle="Upload a still image — AI animates it into a short video clip"
      />
      <div className="p-6 max-w-5xl space-y-6">
        {!limit.loading && (
          <div className="flex items-center gap-3">
            <Badge variant={limit.canGenerate ? "secondary" : "destructive"}>
              {limit.plan === "free"
                ? `${limit.todayCount} / ${limit.dailyLimit} videos today`
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
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">Upload Image</h3>
              </div>

              {/* Dropzone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  imagePreview
                    ? "border-primary/40 bg-primary/5 p-0 overflow-hidden aspect-square max-h-56"
                    : "border-border hover:border-primary/50 bg-muted/30 py-12"
                }`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-primary-foreground text-xs font-medium bg-foreground/60 px-3 py-1 rounded-full">
                        Click to change
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">Drop your image here</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP up to 10MB</p>
                    </div>
                    <Button size="sm" variant="outline" type="button">
                      Browse Files
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

              {/* Motion Type */}
              <div className="space-y-2">
                <Label>Animation Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  {MOTION_TYPES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMotionType(m.id)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        motionType === m.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="text-xs font-semibold text-foreground">{m.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</p>
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
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Animating…</>
                ) : !limit.canGenerate ? (
                  <><Lock className="w-4 h-4 mr-2" /> Limit Reached — Upgrade</>
                ) : (
                  <><Zap className="w-4 h-4 mr-2" /> Animate Image</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col">
              <h3 className="font-display font-semibold text-foreground mb-4">Preview</h3>
              <div className="flex-1 flex items-center justify-center min-h-[300px]">
                <AnimatePresence mode="wait">
                  {generating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-5 w-full max-w-xs"
                    >
                      <motion.div
                        className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <ImageIcon className="w-10 h-10 text-primary" />
                      </motion.div>
                      <div>
                        <p className="font-semibold text-foreground">Animating your image…</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {progress < 40
                            ? "Analyzing composition…"
                            : progress < 75
                            ? "Applying motion effects…"
                            : "Rendering final video…"}
                        </p>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  ) : generatedVideoUrl ? (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full"
                    >
                      <div className="rounded-xl overflow-hidden border border-border bg-foreground/5 aspect-[9/16] max-h-[480px] mx-auto">
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
                        ✓ Saved to My Videos
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
                        Upload an image and click Animate
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

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Mic,
  Loader2,
  Sparkles,
  Lock,
  Play,
  Volume2,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useVideoLimit } from "@/hooks/useVideoLimit";

const VOICES = [
  { id: "nova", label: "Nova", desc: "Warm & friendly female", emoji: "👩" },
  { id: "onyx", label: "Onyx", desc: "Deep & authoritative male", emoji: "👨" },
  { id: "shimmer", label: "Shimmer", desc: "Bright & energetic", emoji: "✨" },
  { id: "echo", label: "Echo", desc: "Smooth & professional", emoji: "🎙️" },
];

const ASPECT_RATIOS = [
  { id: "9:16", label: "9:16", desc: "Reels / TikTok" },
  { id: "1:1", label: "1:1", desc: "Feed Post" },
  { id: "16:9", label: "16:9", desc: "YouTube / Story" },
];

export default function ScriptToVideoPage() {
  const { user } = useAuth();
  const limit = useVideoLimit();

  const [productName, setProductName] = useState("");
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState("nova");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [generating, setGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const wordCount = script.trim().split(/\s+/).filter(Boolean).length;
  const approxDuration = Math.max(Math.round((wordCount / 150) * 60), 5);

  const handleGenerate = async () => {
    if (!script.trim()) {
      toast({ title: "Write a script first", variant: "destructive" });
      return;
    }
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

    await new Promise((r) => setTimeout(r, 3000));

    const mockVideoUrl = "/sample-marketing-reel.mp4";

    if (user) {
      const { error } = await supabase.from("generated_videos").insert({
        user_id: user.id,
        product_name: productName,
        script: script,
        video_url: mockVideoUrl,
      });
      if (error) {
        console.error(error);
        toast({ title: "Error saving video", variant: "destructive" });
      } else {
        await limit.refresh();
        toast({ title: "✅ Video generated & saved to My Videos!" });
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
        title="Script to Video"
        subtitle="Type your script — AI voiceover + visuals turn it into a polished video"
      />
      <div className="p-6 max-w-5xl space-y-6">
        {/* Usage Badge */}
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
              <div className="space-y-1">
                <Label htmlFor="productName">Product / Brand Name</Label>
                <Input
                  id="productName"
                  placeholder="e.g. CloudFit Running Shoes"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="script">Your Script</Label>
                  <span className="text-xs text-muted-foreground">
                    ~{approxDuration}s • {wordCount} words
                  </span>
                </div>
                <Textarea
                  id="script"
                  placeholder={`Write your voiceover script here…\n\nExample:\n"Tired of discomfort? Meet CloudFit — the shoe designed around YOU. Ultra-light, ultra-comfy. Available now at 20% off. Shop the link in bio!"`}
                  rows={8}
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="resize-none font-mono text-sm"
                />
              </div>

              {/* Voice Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" /> AI Voice
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {VOICES.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVoice(v.id)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        voice === v.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {v.emoji} {v.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{v.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <Label>Format</Label>
                <div className="flex gap-2">
                  {ASPECT_RATIOS.map((ar) => (
                    <button
                      key={ar.id}
                      onClick={() => setAspectRatio(ar.id)}
                      className={`flex-1 py-2 rounded-lg border-2 text-center transition-all ${
                        aspectRatio === ar.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="text-xs font-bold text-foreground">{ar.label}</p>
                      <p className="text-[10px] text-muted-foreground">{ar.desc}</p>
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
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Video…</>
                ) : !limit.canGenerate ? (
                  <><Lock className="w-4 h-4 mr-2" /> Limit Reached — Upgrade to Pro</>
                ) : (
                  <><Mic className="w-4 h-4 mr-2" /> Generate with AI Voice</>
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
                      className="text-center space-y-4"
                    >
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Mic className="w-8 h-8 text-primary animate-pulse" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Rendering video…</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Adding voiceover, transitions & music
                        </p>
                      </div>
                      <div className="flex justify-center gap-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full bg-primary"
                            animate={{ height: ["8px", "24px", "8px"] }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.12,
                            }}
                          />
                        ))}
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
                        Your video will appear here after generation
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

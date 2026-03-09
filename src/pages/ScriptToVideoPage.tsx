import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Type,
  Loader2,
  Sparkles,
  Lock,
  Play,
  Wand2,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useVideoLimit } from "@/hooks/useVideoLimit";

const DURATIONS = [
  { id: "15", label: "15s", desc: "Quick promo" },
  { id: "30", label: "30s", desc: "Standard" },
  { id: "60", label: "60s", desc: "Detailed" },
];

const VISUAL_STYLES = [
  { id: "modern", label: "✨ Modern", desc: "Clean motion graphics" },
  { id: "cinematic", label: "🎬 Cinematic", desc: "Dramatic visuals" },
  { id: "playful", label: "🎨 Playful", desc: "Colorful & fun" },
  { id: "minimal", label: "◻️ Minimal", desc: "Simple & elegant" },
];

export default function ScriptToVideoPage() {
  const { user } = useAuth();
  const limit = useVideoLimit();

  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("30");
  const [visualStyle, setVisualStyle] = useState("modern");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: "Enter a text prompt", variant: "destructive" });
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

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    await new Promise((r) => setTimeout(r, 3500));
    clearInterval(progressInterval);
    setProgress(100);

    const mockVideoUrl = "/sample-marketing-reel.mp4";

    if (user) {
      const { error } = await supabase.from("generated_videos").insert({
        user_id: user.id,
        product_name: `Text Video: ${prompt.slice(0, 50)}`,
        script: prompt,
        video_url: mockVideoUrl,
      });
      if (error) {
        console.error(error);
        toast({ title: "Error saving video", variant: "destructive" });
      } else {
        await limit.refresh();
        toast({ title: "✅ Video generated & saved!" });
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
        title="Text to Video"
        subtitle="Describe your video idea — AI transforms it into a visual clip"
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
          <div className="space-y-5">
            <Card>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Type className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">Describe Your Video</h3>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prompt">Text Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder={`Example: "A sleek smartphone rotating on a dark surface with particles of light swirling around it. Text overlay: Available Now. Energetic background music."`}
                    rows={5}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be descriptive — mention objects, movement, mood, and text overlays
                  </p>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <div className="flex gap-2">
                    {DURATIONS.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDuration(d.id)}
                        className={`flex-1 py-2.5 rounded-lg border-2 text-center transition-all ${
                          duration === d.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <p className="text-sm font-bold text-foreground">{d.label}</p>
                        <p className="text-[10px] text-muted-foreground">{d.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Style */}
                <div className="space-y-2">
                  <Label>Visual Style</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {VISUAL_STYLES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setVisualStyle(s.id)}
                        className={`text-left p-3 rounded-xl border-2 transition-all ${
                          visualStyle === s.id
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
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Video…</>
                  ) : !limit.canGenerate ? (
                    <><Lock className="w-4 h-4 mr-2" /> Limit Reached — Upgrade</>
                  ) : (
                    <><Wand2 className="w-4 h-4 mr-2" /> Generate Video</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

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
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Wand2 className="w-8 h-8 text-primary animate-pulse" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Creating your video…</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {progress < 30
                            ? "Analyzing prompt…"
                            : progress < 60
                            ? "Generating visuals…"
                            : progress < 90
                            ? "Adding transitions & effects…"
                            : "Finalizing…"}
                        </p>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
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
                        Enter a prompt and click Generate
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

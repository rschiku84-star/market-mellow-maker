import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool,
  Loader2,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const TONES = [
  { id: "professional", label: "💼 Professional", desc: "Polished & business-ready" },
  { id: "casual", label: "😊 Casual", desc: "Friendly & conversational" },
  { id: "energetic", label: "⚡ Energetic", desc: "Upbeat & exciting" },
  { id: "storytelling", label: "📖 Storytelling", desc: "Narrative & emotional" },
];

const LENGTHS = [
  { id: "short", label: "Short", desc: "15-30 seconds" },
  { id: "medium", label: "Medium", desc: "30-60 seconds" },
  { id: "long", label: "Long", desc: "60-90 seconds" },
];

const MOCK_SCRIPTS: Record<string, string> = {
  professional: `🎬 VIDEO SCRIPT

[SCENE 1 — 0:00-0:05]
VISUAL: Clean title card with brand logo
NARRATION: "In today's fast-paced world, standing out matters."

[SCENE 2 — 0:05-0:15]
VISUAL: Product showcase with smooth rotation
NARRATION: "Introducing a solution designed for those who demand excellence."

[SCENE 3 — 0:15-0:25]
VISUAL: Feature highlights with text overlays
NARRATION: "Crafted with precision. Built to perform. Backed by results."

[SCENE 4 — 0:25-0:30]
VISUAL: Call-to-action with website URL
NARRATION: "Discover the difference. Visit us today."

---
🎵 Music: Corporate ambient
🎤 Voice: Confident, authoritative`,
  casual: `🎬 VIDEO SCRIPT

[SCENE 1 — 0:00-0:05]
VISUAL: Eye-catching hook animation
NARRATION: "Okay so hear me out…"

[SCENE 2 — 0:05-0:15]
VISUAL: Product in lifestyle setting
NARRATION: "I've been using this for a week and honestly? Game changer."

[SCENE 3 — 0:15-0:25]
VISUAL: Quick feature montage with captions
NARRATION: "It just works. No fuss. No hassle. Just results."

[SCENE 4 — 0:25-0:30]
VISUAL: Swipe up / link prompt
NARRATION: "Link in bio — trust me on this one."

---
🎵 Music: Lo-fi trending beat
🎤 Voice: Warm, relatable`,
  energetic: `🎬 VIDEO SCRIPT

[SCENE 1 — 0:00-0:03]
VISUAL: BANG! Fast zoom into product
NARRATION: "STOP scrolling! 🛑"

[SCENE 2 — 0:03-0:12]
VISUAL: Quick cuts — product in action
NARRATION: "This is THE thing everyone's talking about — and here's why!"

[SCENE 3 — 0:12-0:22]
VISUAL: Feature callouts with motion graphics
NARRATION: "Lightning fast. Crazy reliable. And the price? You won't believe it."

[SCENE 4 — 0:22-0:30]
VISUAL: Countdown timer + CTA
NARRATION: "Limited time only — grab yours NOW before it's gone! 🔥"

---
🎵 Music: High-energy EDM drop
🎤 Voice: Hyped, fast-paced`,
  storytelling: `🎬 VIDEO SCRIPT

[SCENE 1 — 0:00-0:08]
VISUAL: Slow-motion sunrise / emotional imagery
NARRATION: "We all have that moment… when nothing seems to work."

[SCENE 2 — 0:08-0:18]
VISUAL: Person discovering the product
NARRATION: "Until you find the one thing that changes everything."

[SCENE 3 — 0:18-0:28]
VISUAL: Transformation montage — before & after
NARRATION: "This isn't just a product. It's the start of something better."

[SCENE 4 — 0:28-0:35]
VISUAL: Soft close with brand message
NARRATION: "Your story starts here."

---
🎵 Music: Emotional piano
🎤 Voice: Warm, inspiring`,
};

export default function AIStudioPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [script, setScript] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({ title: "Enter a topic", variant: "destructive" });
      return;
    }

    setGenerating(true);
    setScript("");

    // Simulate AI generation with streaming effect
    const mockScript = MOCK_SCRIPTS[tone] || MOCK_SCRIPTS.professional;
    const customizedScript = mockScript.replace(
      /product/gi,
      topic.trim()
    );

    await new Promise((r) => setTimeout(r, 1500));

    // Simulate character-by-character typing
    for (let i = 0; i <= customizedScript.length; i += 3) {
      setScript(customizedScript.slice(0, i));
      await new Promise((r) => setTimeout(r, 8));
    }
    setScript(customizedScript);
    setGenerating(false);
    toast({ title: "✅ Script generated!" });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <>
      <DashboardHeader
        title="AI Script Generator"
        subtitle="Enter a topic — AI creates a ready-to-use video script"
      />
      <div className="p-6 max-w-5xl space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <PenTool className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">Script Settings</h3>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="topic">Topic / Product</Label>
                <Input
                  id="topic"
                  placeholder="e.g. Wireless noise-cancelling headphones"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  What should the video be about?
                </p>
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <Label>Tone</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        tone === t.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="text-xs font-semibold text-foreground">{t.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Length */}
              <div className="space-y-2">
                <Label>Script Length</Label>
                <div className="flex gap-2">
                  {LENGTHS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLength(l.id)}
                      className={`flex-1 py-2.5 rounded-lg border-2 text-center transition-all ${
                        length === l.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="text-sm font-bold text-foreground">{l.label}</p>
                      <p className="text-[10px] text-muted-foreground">{l.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full"
                size="lg"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Writing Script…</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Generate Script</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-foreground">Generated Script</h3>
                {script && !generating && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleGenerate}>
                      <RefreshCw className="w-3.5 h-3.5 mr-1" /> Regenerate
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex-1 min-h-[300px]">
                <AnimatePresence mode="wait">
                  {generating || script ? (
                    <motion.div
                      key="script"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                        {script}
                        {generating && (
                          <motion.span
                            className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          />
                        )}
                      </pre>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex items-center justify-center"
                    >
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center">
                          <PenTool className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your AI-generated script will appear here
                        </p>
                      </div>
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

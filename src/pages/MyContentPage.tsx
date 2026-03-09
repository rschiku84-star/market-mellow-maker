import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Download, Trash2, Sparkles, FileText } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Generation {
  id: string;
  tool_name: string;
  title: string | null;
  content: any;
  created_at: string;
}

const TOOL_LABELS: Record<string, string> = {
  "video-generator": "Video Generator",
  "viral-ideas": "Viral Ideas",
  "hook-generator": "Hook Generator",
  "caption-generator": "Caption Generator",
  "script-converter": "Script Converter",
  "tiktok-ideas": "TikTok Ideas",
  "faceless-youtube": "Faceless YouTube",
  "thumbnail-ideas": "Thumbnail Ideas",
  "reel-creator": "Reel Creator",
  "content-repurposer": "Content Repurposer",
  "trending-topics": "Trending Topics",
  "content-calendar": "Content Calendar",
  "viral-hooks": "Viral Hooks",
};

const MyContentPage = () => {
  const { user } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchGenerations = async () => {
      const { data } = await supabase
        .from("ai_generations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      setGenerations((data as Generation[]) ?? []);
      setLoading(false);
    };
    fetchGenerations();
  }, [user]);

  const handleDelete = async (id: string) => {
    await supabase.from("ai_generations").delete().eq("id", id);
    setGenerations((prev) => prev.filter((g) => g.id !== id));
    toast({ title: "Deleted" });
  };

  return (
    <>
      <DashboardHeader title="My Content" subtitle="All your generated content in one place" />
      <div className="p-6 max-w-4xl space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : generations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">No content generated yet. Try one of the AI tools!</p>
            </CardContent>
          </Card>
        ) : (
          generations.map((gen, i) => (
            <motion.div
              key={gen.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {TOOL_LABELS[gen.tool_name] ?? gen.tool_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(gen.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground truncate">{gen.title || "Untitled"}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(gen.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </>
  );
};

export default MyContentPage;

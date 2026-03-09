import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Video,
  Download,
  Share2,
  MessageCircle,
  Trash2,
  Film,
  Clock,
  Loader2,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface GeneratedVideo {
  id: string;
  product_name: string;
  script: string | null;
  video_url: string;
  created_at: string;
}

export default function MyVideosPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("generated_videos")
      .select("id, product_name, script, video_url, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast({ title: "Error loading videos", variant: "destructive" });
    } else {
      setVideos(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, [user]);

  const handleDownload = (video: GeneratedVideo) => {
    const link = document.createElement("a");
    link.href = video.video_url;
    link.download = `${video.product_name}-reel.mp4`;
    link.click();
    toast({ title: "Downloading video…" });
  };

  const handleShareWhatsApp = (video: GeneratedVideo) => {
    const text = video.script
      ? `Check out ${video.product_name}! 🔥\n\n${video.script.slice(0, 500)}`
      : `Check out ${video.product_name}!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareInstagram = (video: GeneratedVideo) => {
    toast({
      title: "Share to Instagram",
      description: "Download the video first, then share from your gallery to Instagram Reels.",
    });
    handleDownload(video);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("generated_videos").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting video", variant: "destructive" });
    } else {
      setVideos((prev) => prev.filter((v) => v.id !== id));
      toast({ title: "Video deleted" });
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <DashboardHeader title="My Videos" subtitle="All your generated marketing reels in one place" />
      <div className="p-6 space-y-6 max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Film className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Videos</p>
                <p className="font-display text-2xl font-bold text-foreground">{videos.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Latest Video</p>
                <p className="font-display text-sm font-bold text-foreground truncate max-w-[160px]">
                  {videos.length > 0 ? videos[0].product_name : "—"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Duration</p>
                <p className="font-display text-2xl font-bold text-foreground">{videos.length * 10}s</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : videos.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display font-semibold text-lg text-foreground mb-1">No videos yet</h3>
              <p className="text-sm text-muted-foreground">
                Go to AI Studio → Video Reel tab to generate your first marketing reel.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden">
                  {/* Video player */}
                  <div className="bg-black aspect-video">
                    <video
                      src={video.video_url}
                      controls
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-display font-semibold text-foreground truncate">{video.product_name}</h4>
                        <p className="text-xs text-muted-foreground">{formatDate(video.created_at)}</p>
                      </div>
                    </div>

                    {video.script && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{video.script}</p>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleDownload(video)}>
                        <Download className="w-3.5 h-3.5 mr-1" /> Download
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleShareWhatsApp(video)}>
                        <MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleShareInstagram(video)}>
                        <Share2 className="w-3.5 h-3.5 mr-1" /> Instagram
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive ml-auto"
                        onClick={() => handleDelete(video.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

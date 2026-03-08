import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Instagram,
  Facebook,
  Music2,
  Send,
  Calendar as CalendarIcon,
  Trash2,
  Clock,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useProductsContext } from "@/contexts/ProductsContext";
import { useScheduledPosts, type ScheduledPost } from "@/hooks/useScheduledPosts";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram, color: "bg-gradient-to-br from-purple-500 to-pink-500" },
  { id: "tiktok", label: "TikTok", icon: Music2, color: "bg-gradient-to-br from-gray-900 to-gray-700" },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "bg-blue-600" },
];

const statusConfig: Record<ScheduledPost["status"], { label: string; icon: typeof FileText; className: string }> = {
  draft: { label: "Draft", icon: FileText, className: "bg-muted text-muted-foreground" },
  scheduled: { label: "Scheduled", icon: Clock, className: "bg-amber-500/10 text-amber-600 border-amber-200" },
  published: { label: "Published", icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
};

const SocialMediaPage = () => {
  const { products } = useProductsContext();
  const { posts, loading, addPost, deletePost, updatePostStatus } = useScheduledPosts();

  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (asDraft: boolean) => {
    if (!content.trim()) {
      toast({ title: "Content required", description: "Write something to post.", variant: "destructive" });
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast({ title: "Select platforms", description: "Choose at least one platform.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const status = asDraft ? "draft" : scheduledDate ? "scheduled" : "draft";

    await addPost({
      productId: selectedProductId || null,
      content: content.trim(),
      platforms: selectedPlatforms,
      scheduledAt: scheduledDate ?? null,
      status,
    });

    toast({
      title: asDraft ? "Draft saved" : "Post scheduled!",
      description: asDraft
        ? "Your post has been saved as a draft."
        : `Scheduled for ${scheduledDate ? format(scheduledDate, "PPP") : "now"}.`,
    });

    setContent("");
    setSelectedPlatforms([]);
    setSelectedProductId("");
    setScheduledDate(undefined);
    setIsSubmitting(false);
  };

  const charCount = content.length;
  const charLimit = selectedPlatforms.includes("tiktok") ? 150 : 2200;

  return (
    <>
      <DashboardHeader
        title="Social Media"
        subtitle="Compose posts and schedule across platforms"
      />
      <div className="p-6 space-y-6 max-w-4xl">
        {/* Composer */}
        <Card>
          <CardContent className="p-6 space-y-5">
            {/* Platform Selection */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Platforms
              </label>
              <div className="flex gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-medium",
                      selectedPlatforms.includes(p.id)
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-white", p.color)}>
                      <p.icon className="w-3.5 h-3.5" />
                    </div>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Link Product (optional) */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
                Link Product <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-foreground">Post Content</label>
                <span className={cn("text-xs", charCount > charLimit ? "text-destructive" : "text-muted-foreground")}>
                  {charCount}/{charLimit}
                </span>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post caption..."
                className="min-h-[120px]"
              />
            </div>

            {/* Schedule */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
                Schedule
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !scheduledDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date (optional)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {scheduledDate ? "Schedule Post" : "Save Post"}
              </Button>
              <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting}>
                Save Draft
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Queue */}
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Scheduled Queue
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">No posts yet</p>
                <p className="text-xs text-muted-foreground mt-1">Compose your first post above</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {posts.map((post, i) => {
                  const sc = statusConfig[post.status];
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Platforms */}
                            <div className="flex flex-col gap-1.5 pt-0.5">
                              {post.platforms.map((pid) => {
                                const plat = PLATFORMS.find((p) => p.id === pid);
                                if (!plat) return null;
                                return (
                                  <div
                                    key={pid}
                                    className={cn("w-7 h-7 rounded-md flex items-center justify-center text-white", plat.color)}
                                  >
                                    <plat.icon className="w-3.5 h-3.5" />
                                  </div>
                                );
                              })}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground line-clamp-2">{post.content}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", sc.className)}>
                                  <sc.icon className="w-3 h-3 mr-1" />
                                  {sc.label}
                                </Badge>
                                {post.scheduledAt && (
                                  <span className="text-[11px] text-muted-foreground">
                                    {format(post.scheduledAt, "MMM d, yyyy")}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1.5">
                              {post.status === "draft" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updatePostStatus(post.id, "scheduled")}
                                  className="text-xs"
                                >
                                  <Clock className="w-3 h-3 mr-1" /> Schedule
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => deletePost(post.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SocialMediaPage;

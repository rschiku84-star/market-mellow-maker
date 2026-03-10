import { useState } from "react";
import { Film, CreditCard, Zap, Crown, Sparkles, Video, Lightbulb, MessageSquare, FileText, Music, Youtube, Image, Instagram, Repeat, TrendingUp, CalendarDays, BookOpen, Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";

const allTools = [
  { to: "/dashboard/video-generator", icon: Video, label: "AI Video Generator", desc: "Generate complete video scripts" },
  { to: "/dashboard/viral-ideas", icon: Lightbulb, label: "Viral Idea Generator", desc: "10-15 viral content ideas" },
  { to: "/dashboard/hook-generator", icon: Zap, label: "Hook Generator", desc: "10 scroll-stopping hooks" },
  { to: "/dashboard/caption-generator", icon: MessageSquare, label: "Caption Generator", desc: "Platform-specific captions" },
  { to: "/dashboard/script-converter", icon: FileText, label: "Script Converter", desc: "Long to short-form scripts" },
  { to: "/dashboard/tiktok-ideas", icon: Music, label: "TikTok Ideas", desc: "15 viral TikTok ideas" },
  { to: "/dashboard/faceless-youtube", icon: Youtube, label: "Faceless YouTube", desc: "Full YouTube video scripts" },
  { to: "/dashboard/thumbnail-ideas", icon: Image, label: "Thumbnail Ideas", desc: "Thumbnail text & visuals" },
  { to: "/dashboard/reel-creator", icon: Instagram, label: "Reel Creator", desc: "Reel ideas & captions" },
  { to: "/dashboard/content-repurposer", icon: Repeat, label: "Content Repurposer", desc: "Repurpose long-form content" },
  { to: "/dashboard/trending-topics", icon: TrendingUp, label: "Trending Topics", desc: "20 trending content ideas" },
  { to: "/dashboard/content-calendar", icon: CalendarDays, label: "Content Calendar", desc: "30-day posting plan" },
  { to: "/dashboard/viral-hooks", icon: BookOpen, label: "Viral Hook Library", desc: "100 proven viral hooks" },
];

const DashboardOverview = () => {
  const { user } = useAuth();
  const { plan, used, limit, remaining, loading } = useCredits();
  const [search, setSearch] = useState("");

  const planLabel = plan === "pro" ? "Pro" : plan === "premium" ? "Premium" : plan === "business" ? "Business" : "Free";
  const progressPercent = limit ? (used / limit) * 100 : 0;

  const filteredTools = allTools.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Credits Used", value: loading ? "—" : String(used), icon: Film, subtitle: limit ? `of ${limit} today` : "Unlimited" },
    { label: "Current Plan", value: loading ? "—" : planLabel, icon: plan === "free" ? Zap : Crown, subtitle: plan === "free" ? "Upgrade for unlimited" : "Active subscription" },
    { label: "Remaining", value: loading ? "—" : remaining !== null ? String(remaining) : "∞", icon: CreditCard, subtitle: remaining !== null ? "credits today" : "Unlimited credits" },
  ];

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        subtitle={`Welcome back${user?.user_metadata?.username ? `, ${user.user_metadata.username}` : ""}! Here's your overview.`}
      />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }}>
              <Card className="h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                      <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Usage bar */}
        {limit !== null && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Daily Usage</p>
                  <p className="text-xs text-muted-foreground">{used} / {limit} generations</p>
                </div>
                <Progress value={progressPercent} className="h-2" />
                {remaining === 0 && (
                  <p className="text-xs text-muted-foreground">
                    You've reached your daily limit. <Link to="/dashboard/subscription" className="text-primary hover:underline">Upgrade to Pro</Link> for unlimited.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search + All Tools */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">All AI Tools</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTools.map((tool, i) => (
              <motion.div key={tool.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.03 }}>
                <Link to={tool.to}>
                  <Card className="hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer h-full">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <tool.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">{tool.label}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{tool.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
            {filteredTools.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full text-center py-8">No tools match your search.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;

import { Film, CreditCard, Zap, Crown, Sparkles, Video, Lightbulb, MessageSquare, FileText, Music, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";

const quickTools = [
  { to: "/dashboard/video-generator", icon: Video, label: "Video Generator", color: "text-primary" },
  { to: "/dashboard/viral-ideas", icon: Lightbulb, label: "Viral Ideas", color: "text-accent-foreground" },
  { to: "/dashboard/hook-generator", icon: Zap, label: "Hook Generator", color: "text-primary" },
  { to: "/dashboard/caption-generator", icon: MessageSquare, label: "Captions", color: "text-accent-foreground" },
  { to: "/dashboard/faceless-youtube", icon: Youtube, label: "Faceless YouTube", color: "text-primary" },
  { to: "/dashboard/tiktok-ideas", icon: Music, label: "TikTok Ideas", color: "text-accent-foreground" },
];

const DashboardOverview = () => {
  const { user } = useAuth();
  const { plan, used, limit, remaining, loading } = useCredits();

  const planLabel = plan === "pro" ? "Pro" : plan === "premium" ? "Premium" : plan === "business" ? "Business" : "Free";
  const progressPercent = limit ? (used / limit) * 100 : 0;

  const stats = [
    {
      label: "Credits Used",
      value: loading ? "—" : String(used),
      icon: Film,
      subtitle: limit ? `of ${limit} this month` : "Unlimited",
    },
    {
      label: "Current Plan",
      value: loading ? "—" : planLabel,
      icon: plan === "free" ? Zap : Crown,
      subtitle: plan === "free" ? "Upgrade for more credits" : "Active subscription",
    },
    {
      label: "Remaining",
      value: loading ? "—" : remaining !== null ? String(remaining) : "∞",
      icon: CreditCard,
      subtitle: remaining !== null ? "credits this month" : "Unlimited credits",
    },
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
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <Card className="card-glow h-full">
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
                  <p className="text-sm font-semibold text-foreground">Monthly Usage</p>
                  <p className="text-xs text-muted-foreground">{used} / {limit} generations</p>
                </div>
                <Progress value={progressPercent} className="h-2" />
                {remaining === 0 && (
                  <p className="text-xs text-muted-foreground">
                    You've reached your limit. <Link to="/dashboard/subscription" className="text-primary hover:underline">Upgrade your plan</Link> for more.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick access tools */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Quick Access Tools</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickTools.map((tool, i) => (
              <motion.div
                key={tool.to}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <Link to={tool.to}>
                  <Card className="hover:card-hover-glow transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <tool.icon className={cn("w-4 h-4", tool.color)} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{tool.label}</span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;

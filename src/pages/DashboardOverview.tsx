import { Film, CreditCard, Zap, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useVideoLimit } from "@/hooks/useVideoLimit";

const DashboardOverview = () => {
  const { user } = useAuth();
  const { plan, todayCount, dailyLimit, loading } = useVideoLimit();

  const remaining = dailyLimit !== null ? Math.max(0, dailyLimit - todayCount) : null;
  const progressPercent = dailyLimit ? (todayCount / dailyLimit) * 100 : 0;

  const planLabel = plan === "pro" ? "Pro" : plan === "business" ? "Business" : "Free";
  const planIcon = plan === "free" ? Zap : Crown;
  const PlanIcon = planIcon;

  const stats = [
    {
      label: "Videos Generated Today",
      value: loading ? "—" : String(todayCount),
      icon: Film,
      subtitle: dailyLimit ? `of ${dailyLimit} daily limit` : "Unlimited",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Current Plan",
      value: loading ? "—" : planLabel,
      icon: PlanIcon,
      subtitle: plan === "free" ? "Upgrade for unlimited" : "Active subscription",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Remaining Credits",
      value: loading ? "—" : remaining !== null ? String(remaining) : "∞",
      icon: CreditCard,
      subtitle: remaining !== null ? "credits left today" : "Unlimited credits",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        subtitle={`Welcome back${user?.user_metadata?.username ? `, ${user.user_metadata.username}` : ""}! Here's your overview.`}
      />
      <div className="p-6 space-y-6">
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
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="font-display text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                    </div>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bgColor)}>
                      <stat.icon className={cn("w-5 h-5", stat.color)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Usage bar for free plan */}
        {dailyLimit !== null && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Daily Usage</p>
                  <p className="text-xs text-muted-foreground">
                    {todayCount} / {dailyLimit} videos
                  </p>
                </div>
                <Progress value={progressPercent} className="h-2" />
                {remaining === 0 && (
                  <p className="text-xs text-muted-foreground">
                    You've reached your daily limit. Upgrade to Pro for unlimited generations.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </>
  );
};

// cn utility is already imported via the Card, but we need it here
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default DashboardOverview;

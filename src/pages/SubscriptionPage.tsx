import { motion } from "framer-motion";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCredits } from "@/hooks/useCredits";
import { toast } from "@/hooks/use-toast";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    icon: Zap,
    features: ["5 AI generations / month", "All 13 AI tools", "Copy & download outputs", "Content history"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "/month",
    icon: Crown,
    popular: true,
    features: ["50 AI generations / month", "All 13 AI tools", "Priority support", "Early access to new tools"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$49",
    period: "/month",
    icon: Rocket,
    features: ["Unlimited AI generations", "All 13 AI tools", "Priority support", "API access", "Custom branding"],
  },
];

const SubscriptionPage = () => {
  const { plan: currentPlan, loading } = useCredits();

  const handleUpgrade = (planId: string) => {
    if (planId === currentPlan) return;
    toast({
      title: "Coming soon",
      description: "Stripe payment integration will be available soon. Stay tuned!",
    });
  };

  return (
    <>
      <DashboardHeader title="Subscription Plan" subtitle="Manage your plan and billing" />
      <div className="p-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => {
            const isCurrent = plan.id === currentPlan;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <Card className={`relative h-full ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <plan.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-display font-bold text-foreground">{plan.name}</h3>
                    </div>
                    <div className="mb-5">
                      <span className="font-display text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    </div>
                    <ul className="space-y-2.5 flex-1 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={isCurrent ? "outline" : plan.popular ? "default" : "outline"}
                      className="w-full"
                      disabled={isCurrent || loading}
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {isCurrent ? "Current Plan" : "Upgrade"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;

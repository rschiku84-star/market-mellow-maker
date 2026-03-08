import { Package, DollarSign, Eye, TrendingUp } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Total Products", value: "4", icon: Package, change: "+2 this week" },
  { label: "Total Revenue", value: "$221.49", icon: DollarSign, change: "+12%" },
  { label: "Page Views", value: "1,284", icon: Eye, change: "+8%" },
  { label: "Conversion Rate", value: "3.2%", icon: TrendingUp, change: "+0.4%" },
];

const DashboardOverview = () => {
  return (
    <>
      <DashboardHeader title="Dashboard" subtitle="Welcome back! Here's your overview." />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="card-glow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="font-display text-2xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-primary mt-1">{stat.change}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;

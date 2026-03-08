import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Mock data -----------------------------------------------------------

const revenueData = [
  { month: "Sep", revenue: 420 },
  { month: "Oct", revenue: 680 },
  { month: "Nov", revenue: 530 },
  { month: "Dec", revenue: 910 },
  { month: "Jan", revenue: 750 },
  { month: "Feb", revenue: 1120 },
  { month: "Mar", revenue: 980 },
];

const viewsData = [
  { day: "Mon", views: 320, unique: 210 },
  { day: "Tue", views: 480, unique: 310 },
  { day: "Wed", views: 390, unique: 260 },
  { day: "Thu", views: 620, unique: 420 },
  { day: "Fri", views: 540, unique: 370 },
  { day: "Sat", views: 280, unique: 180 },
  { day: "Sun", views: 350, unique: 230 },
];

const socialData = [
  { week: "W1", instagram: 320, tiktok: 580, facebook: 190 },
  { week: "W2", instagram: 410, tiktok: 720, facebook: 230 },
  { week: "W3", instagram: 380, tiktok: 650, facebook: 280 },
  { week: "W4", instagram: 520, tiktok: 890, facebook: 310 },
];

const categoryData = [
  { name: "Home & Living", value: 35 },
  { name: "Digital Art", value: 25 },
  { name: "Fashion", value: 20 },
  { name: "Jewelry", value: 12 },
  { name: "Other", value: 8 },
];

const CHART_COLORS = [
  "hsl(16, 85%, 60%)",
  "hsl(45, 95%, 60%)",
  "hsl(220, 50%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(280, 50%, 55%)",
];

const kpiCards = [
  {
    label: "Total Revenue",
    value: "$5,390",
    change: "+18.2%",
    up: true,
    icon: DollarSign,
  },
  {
    label: "Product Views",
    value: "12,847",
    change: "+8.4%",
    up: true,
    icon: Eye,
  },
  {
    label: "Social Reach",
    value: "24.6K",
    change: "+32.1%",
    up: true,
    icon: Users,
  },
  {
    label: "Conversion Rate",
    value: "3.8%",
    change: "-0.3%",
    up: false,
    icon: TrendingUp,
  },
];

// --- Custom tooltip -------------------------------------------------------

const ChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs text-muted-foreground">
          <span
            className="inline-block w-2 h-2 rounded-full mr-1.5"
            style={{ background: p.color }}
          />
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

// --- Page -----------------------------------------------------------------

const AnalyticsPage = () => {
  const fadeUp = useMemo(
    () => ({
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
    }),
    []
  );

  return (
    <>
      <DashboardHeader
        title="Analytics"
        subtitle="Track performance across products and social channels"
      />

      <div className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              {...fadeUp}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <Card className="card-glow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {kpi.label}
                      </p>
                      <p className="font-display text-2xl font-bold text-foreground mt-1">
                        {kpi.value}
                      </p>
                      <p
                        className={`text-xs mt-1 flex items-center gap-0.5 ${
                          kpi.up ? "text-emerald-600" : "text-destructive"
                        }`}
                      >
                        {kpi.up ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {kpi.change}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <kpi.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.15 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(16, 85%, 60%)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(16, 85%, 60%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 88%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 45%)" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 45%)" tickFormatter={(v) => `$${v}`} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="hsl(16, 85%, 60%)"
                        strokeWidth={2.5}
                        fill="url(#revGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Views */}
          <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Product Views (This Week)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={viewsData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 88%)" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 45%)" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 45%)" />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="views" name="Total Views" fill="hsl(16, 85%, 60%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="unique" name="Unique Visitors" fill="hsl(45, 95%, 60%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Social Media Engagement */}
          <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.25 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Social Media Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="space-y-4">
                  <TabsList className="h-8">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="instagram" className="text-xs">Instagram</TabsTrigger>
                    <TabsTrigger value="tiktok" className="text-xs">TikTok</TabsTrigger>
                    <TabsTrigger value="facebook" className="text-xs">Facebook</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-0">
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={socialData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 88%)" />
                          <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 45%)" />
                          <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 45%)" />
                          <Tooltip content={<ChartTooltip />} />
                          <Line type="monotone" dataKey="instagram" name="Instagram" stroke="hsl(330, 70%, 55%)" strokeWidth={2} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="tiktok" name="TikTok" stroke="hsl(170, 75%, 40%)" strokeWidth={2} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="facebook" name="Facebook" stroke="hsl(220, 60%, 55%)" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  {["instagram", "tiktok", "facebook"].map((platform) => (
                    <TabsContent key={platform} value={platform} className="mt-0">
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={socialData}>
                            <defs>
                              <linearGradient id={`${platform}Grad`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={
                                  platform === "instagram" ? "hsl(330, 70%, 55%)" :
                                  platform === "tiktok" ? "hsl(170, 75%, 40%)" :
                                  "hsl(220, 60%, 55%)"
                                } stopOpacity={0.3} />
                                <stop offset="100%" stopColor={
                                  platform === "instagram" ? "hsl(330, 70%, 55%)" :
                                  platform === "tiktok" ? "hsl(170, 75%, 40%)" :
                                  "hsl(220, 60%, 55%)"
                                } stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 88%)" />
                            <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 45%)" />
                            <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 45%)" />
                            <Tooltip content={<ChartTooltip />} />
                            <Area
                              type="monotone"
                              dataKey={platform}
                              name={platform.charAt(0).toUpperCase() + platform.slice(1)}
                              stroke={
                                platform === "instagram" ? "hsl(330, 70%, 55%)" :
                                platform === "tiktok" ? "hsl(170, 75%, 40%)" :
                                "hsl(220, 60%, 55%)"
                              }
                              strokeWidth={2}
                              fill={`url(#${platform}Grad)`}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sales by Category */}
          <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.3 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Sales by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56 flex items-center">
                  <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        strokeWidth={2}
                        stroke="hsl(0, 0%, 100%)"
                      >
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2.5 pl-2">
                    {categoryData.map((cat, i) => (
                      <div key={cat.name} className="flex items-center gap-2 text-sm">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <span className="text-muted-foreground text-xs flex-1">{cat.name}</span>
                        <span className="font-semibold text-foreground text-xs">{cat.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;

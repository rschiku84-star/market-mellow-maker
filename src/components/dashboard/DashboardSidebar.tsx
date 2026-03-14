import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sparkles,
  Settings,
  LogOut,
  Video,
  ShoppingBag,
  Lightbulb,
  Zap,
  MessageSquare,
  FileText,
  Music,
  Youtube,
  Image,
  Instagram,
  Repeat,
  TrendingUp,
  CalendarDays,
  BookOpen,
  FolderOpen,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { useState } from "react";

const aiTools = [
  { to: "/dashboard/video-generator", icon: Video, label: "AI Video Generator" },
  { to: "/dashboard/viral-ideas", icon: Lightbulb, label: "Viral Idea Generator" },
  { to: "/dashboard/hook-generator", icon: Zap, label: "Hook Generator" },
  { to: "/dashboard/caption-generator", icon: MessageSquare, label: "Caption Generator" },
  { to: "/dashboard/script-converter", icon: FileText, label: "Script Generator" },
  { to: "/dashboard/tiktok-ideas", icon: Music, label: "TikTok Ideas" },
  { to: "/dashboard/faceless-youtube", icon: Youtube, label: "Faceless YouTube" },
  { to: "/dashboard/thumbnail-ideas", icon: Image, label: "Thumbnail Ideas" },
  { to: "/dashboard/reel-creator", icon: Instagram, label: "Reel Creator" },
  { to: "/dashboard/content-repurposer", icon: Repeat, label: "Content Repurposer" },
  { to: "/dashboard/trending-topics", icon: TrendingUp, label: "Trending Topics" },
  { to: "/dashboard/content-calendar", icon: CalendarDays, label: "Content Calendar" },
  { to: "/dashboard/viral-hooks", icon: BookOpen, label: "Viral Hook Library" },
];

const DashboardSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { remaining, limit, plan, loading } = useCredits();
  const [toolsOpen, setToolsOpen] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    );

  return (
    <aside className="flex flex-col w-64 border-r border-border bg-card min-h-screen">
      <div className="p-5 border-b border-border">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">CreatorHub</span>
        </NavLink>
      </div>

      {/* Credits badge */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-foreground">
            {loading ? "..." : limit !== null ? `${remaining}/${limit} today` : "Unlimited"}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <NavLink to="/dashboard" end className={linkClass}>
          <LayoutDashboard className="w-4 h-4" />
          Dashboard Home
        </NavLink>

        {/* AI Tools section */}
        <button
          onClick={() => setToolsOpen(!toolsOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-1 hover:text-foreground transition-colors"
        >
          AI Tools
          <ChevronDown className={cn("w-3 h-3 transition-transform", toolsOpen && "rotate-180")} />
        </button>

        {toolsOpen && aiTools.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-border space-y-0.5">
          <NavLink to="/dashboard/shop-catalog" className={linkClass}>
            <ShoppingBag className="w-4 h-4" />
            Shop Mode
          </NavLink>
          <NavLink to="/dashboard/my-content" className={linkClass}>
            <FolderOpen className="w-4 h-4" />
            My Content
          </NavLink>
          <NavLink to="/dashboard/subscription" className={linkClass}>
            <CreditCard className="w-4 h-4" />
            Subscription Plan
          </NavLink>
          <NavLink to="/dashboard/settings" className={linkClass}>
            <Settings className="w-4 h-4" />
            Settings
          </NavLink>
        </div>
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

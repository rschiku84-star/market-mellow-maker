import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sparkles,
  Settings,
  LogOut,
  Film,
  ImageIcon,
  FileText,
  CreditCard,
  PenTool,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard Home", end: true },
  { to: "/dashboard/script-to-video", icon: FileText, label: "Text to Video" },
  { to: "/dashboard/image-to-reel", icon: ImageIcon, label: "Image to Video" },
  { to: "/dashboard/ai-studio", icon: PenTool, label: "AI Script Generator" },
  { to: "/dashboard/my-videos", icon: Film, label: "My Videos" },
  { to: "/dashboard/subscription", icon: CreditCard, label: "Subscription Plan" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const DashboardSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside className="flex flex-col w-64 border-r border-border bg-card min-h-screen">
      <div className="p-6 border-b border-border">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            CreatorHub
          </span>
        </NavLink>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

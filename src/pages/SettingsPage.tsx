import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Save } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SettingsPage = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.user_metadata?.username ?? "DemoUser");
  const [bio, setBio] = useState("");
  const [avatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Profile saved", description: "Your changes have been saved (demo mode)." });
    }, 500);
  };

  const initials = username ? username.slice(0, 2).toUpperCase() : "DU";

  return (
    <>
      <DashboardHeader title="Settings" subtitle="Manage your profile and preferences" />
      <div className="p-6 max-w-2xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-5">
              <div className="relative group">
                <Avatar className="w-20 h-20 border-2 border-border">
                  <AvatarImage src={avatarUrl ?? undefined} />
                  <AvatarFallback className="text-lg font-display font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <button type="button" className="absolute inset-0 rounded-full bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{username || user?.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                <Button variant="outline" size="sm" className="mt-2">Change photo</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-foreground font-semibold">Email</Label>
                <Input id="email" value={user?.email ?? ""} disabled className="mt-1.5 bg-muted" />
              </div>
              <div>
                <Label htmlFor="username" className="text-foreground font-semibold">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your display name" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="bio" className="text-foreground font-semibold">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." className="mt-1.5 min-h-[100px]" />
              </div>
              <div className="pt-2">
                <Button onClick={handleSave} disabled={saving} className="px-8">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default SettingsPage;

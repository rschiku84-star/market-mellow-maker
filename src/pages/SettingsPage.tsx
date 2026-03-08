import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2, Save } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const SettingsPage = () => {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("username, bio, avatar_url").eq("user_id", user.id).single();
      if (data) { setUsername(data.username ?? ""); setBio(data.bio ?? ""); setAvatarUrl(data.avatar_url); }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const freshUrl = `${urlData.publicUrl}?t=${Date.now()}`;
    setAvatarUrl(freshUrl);
    await supabase.from("profiles").update({ avatar_url: freshUrl }).eq("user_id", user.id);
    setUploading(false);
    toast({ title: "Avatar updated" });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ username: username.trim() || null, bio: bio.trim() || null }).eq("user_id", user.id);
    setSaving(false);
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Profile saved", description: "Your changes have been saved." }); }
  };

  const initials = username ? username.slice(0, 2).toUpperCase() : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  if (loading) {
    return (<><DashboardHeader title="Settings" subtitle="Manage your profile" /><div className="flex items-center justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></>);
  }

  return (
    <>
      <DashboardHeader title="Settings" subtitle="Manage your profile and preferences" />
      <div className="p-6 max-w-2xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground">Profile Photo</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-5">
              <div className="relative group">
                <Avatar className="w-20 h-20 border-2 border-border">
                  <AvatarImage src={avatarUrl ?? undefined} />
                  <AvatarFallback className="text-lg font-display font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="absolute inset-0 rounded-full bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleAvatarUpload(file); }} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{username || user?.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => fileRef.current?.click()} disabled={uploading}>Change photo</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 }}>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground">Profile Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="email" className="text-foreground font-semibold">Email</Label><Input id="email" value={user?.email ?? ""} disabled className="mt-1.5 bg-muted" /></div>
              <div><Label htmlFor="username" className="text-foreground font-semibold">Username</Label><Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your display name" className="mt-1.5" /></div>
              <div><Label htmlFor="bio" className="text-foreground font-semibold">Bio</Label><Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." className="mt-1.5 min-h-[100px]" /></div>
              <div className="pt-2">
                <Button onClick={handleSave} disabled={saving} className="px-8">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save Changes
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

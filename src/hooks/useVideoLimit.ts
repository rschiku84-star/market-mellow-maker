import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface VideoLimitInfo {
  plan: "free" | "pro" | "business";
  todayCount: number;
  dailyLimit: number | null; // null = unlimited
  canGenerate: boolean;
  loading: boolean;
}

export function useVideoLimit() {
  const { user } = useAuth();
  const [info, setInfo] = useState<VideoLimitInfo>({
    plan: "free",
    todayCount: 0,
    dailyLimit: 3,
    canGenerate: true,
    loading: true,
  });

  const refresh = async () => {
    if (!user) return;

    // Fetch profile plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    const plan = (profile?.plan as "free" | "pro" | "business") ?? "free";
    const dailyLimit = plan === "free" ? 3 : null;

    // Count today's videos
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("generated_videos")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfDay.toISOString());

    const todayCount = count ?? 0;
    const canGenerate = dailyLimit === null || todayCount < dailyLimit;

    setInfo({ plan, todayCount, dailyLimit, canGenerate, loading: false });
  };

  useEffect(() => {
    refresh();
  }, [user]);

  return { ...info, refresh };
}

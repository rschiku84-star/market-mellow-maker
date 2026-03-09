import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const PLAN_LIMITS: Record<string, number | null> = {
  free: 5,
  pro: 50,
  premium: null,
  business: null,
};

export function useCredits() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<string>("free");
  const [used, setUsed] = useState(0);
  const [limit, setLimit] = useState<number | null>(5);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    const userPlan = profile?.plan ?? "free";
    setPlan(userPlan);
    setLimit(PLAN_LIMITS[userPlan] ?? PLAN_LIMITS.free!);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("ai_generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    setUsed(count ?? 0);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remaining = limit !== null ? Math.max(0, limit - used) : null;
  const canGenerate = limit === null || used < limit;

  return { plan, used, limit, remaining, canGenerate, loading, refresh };
}

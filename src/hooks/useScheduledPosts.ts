import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ScheduledPost {
  id: string;
  productId: string | null;
  content: string;
  platforms: string[];
  scheduledAt: Date | null;
  status: "draft" | "scheduled" | "published";
  createdAt: Date;
}

export function useScheduledPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!user) { setPosts([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("scheduled_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(
        data.map((p: any) => ({
          id: p.id,
          productId: p.product_id,
          content: p.content,
          platforms: p.platforms ?? [],
          scheduledAt: p.scheduled_at ? new Date(p.scheduled_at) : null,
          status: p.status as ScheduledPost["status"],
          createdAt: new Date(p.created_at),
        }))
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const addPost = async (post: Omit<ScheduledPost, "id" | "createdAt">) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("scheduled_posts")
      .insert({
        user_id: user.id,
        product_id: post.productId,
        content: post.content,
        platforms: post.platforms,
        scheduled_at: post.scheduledAt?.toISOString() ?? null,
        status: post.status,
      })
      .select()
      .single();

    if (!error && data) {
      await fetchPosts();
      return data;
    }
    return null;
  };

  const deletePost = async (id: string) => {
    await supabase.from("scheduled_posts").delete().eq("id", id);
    await fetchPosts();
  };

  const updatePostStatus = async (id: string, status: ScheduledPost["status"]) => {
    await supabase.from("scheduled_posts").update({ status }).eq("id", id);
    await fetchPosts();
  };

  return { posts, loading, addPost, deletePost, updatePostStatus };
}

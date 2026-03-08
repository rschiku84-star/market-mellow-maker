import { useState, useCallback } from "react";

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
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading] = useState(false);

  const addPost = useCallback(async (post: Omit<ScheduledPost, "id" | "createdAt">) => {
    const newPost: ScheduledPost = {
      ...post,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  }, []);

  const deletePost = useCallback(async (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePostStatus = useCallback(async (id: string, status: ScheduledPost["status"]) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }, []);

  return { posts, loading, addPost, deletePost, updatePostStatus };
}

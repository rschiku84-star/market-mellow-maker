import { Music } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const TikTokIdeasPage = () => (
  <AIToolLayout
    title="TikTok Idea Generator"
    subtitle="Get 15 viral TikTok video ideas with hooks and hashtags"
    toolId="tiktok-ideas"
    placeholder="e.g. Personal finance for Gen Z, Home workout routines, Day in my life as a..."
    icon={<Music className="w-4 h-4" />}
    inputLabel="Enter your niche or topic"
  />
);

export default TikTokIdeasPage;

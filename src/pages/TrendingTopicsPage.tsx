import { TrendingUp } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const TrendingTopicsPage = () => (
  <AIToolLayout
    title="Trending Topic Finder"
    subtitle="Discover 20 trending content ideas in your niche"
    toolId="trending-topics"
    placeholder="e.g. Motivation, Business, Tech, Fitness, Finance, Beauty..."
    icon={<TrendingUp className="w-4 h-4" />}
    inputLabel="Select or enter your niche"
  />
);

export default TrendingTopicsPage;

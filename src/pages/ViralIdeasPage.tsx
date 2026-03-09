import { Lightbulb } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const ViralIdeasPage = () => (
  <AIToolLayout
    title="Viral Idea Generator"
    subtitle="Get 10-15 viral content ideas for your niche"
    toolId="viral-ideas"
    placeholder="e.g. Fitness, Personal Finance, Tech Reviews, Cooking, Self-improvement..."
    icon={<Lightbulb className="w-4 h-4" />}
    inputLabel="Enter your niche"
  />
);

export default ViralIdeasPage;

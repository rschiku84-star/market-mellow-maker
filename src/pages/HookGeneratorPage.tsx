import { Zap } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const HookGeneratorPage = () => (
  <AIToolLayout
    title="Hook Generator"
    subtitle="Generate 10 scroll-stopping hooks for short-form videos"
    toolId="hook-generator"
    placeholder="e.g. productivity tips for entrepreneurs, weight loss journey, crypto investing..."
    icon={<Zap className="w-4 h-4" />}
    inputLabel="Enter your topic"
  />
);

export default HookGeneratorPage;

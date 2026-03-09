import { MessageSquare } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const CaptionGeneratorPage = () => (
  <AIToolLayout
    title="Caption Generator"
    subtitle="Generate platform-specific captions with hashtags and emojis"
    toolId="caption-generator"
    placeholder="e.g. New protein shake launch, My morning routine, Budget travel tips..."
    icon={<MessageSquare className="w-4 h-4" />}
    inputLabel="Enter your topic or product"
  />
);

export default CaptionGeneratorPage;

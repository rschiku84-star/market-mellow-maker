import { PenTool } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const AIStudioPage = () => (
  <AIToolLayout
    title="AI Script Generator"
    subtitle="Enter a topic — AI creates a ready-to-use video script"
    toolId="video-generator"
    placeholder="e.g. Wireless noise-cancelling headphones, Morning routine tips..."
    icon={<PenTool className="w-4 h-4" />}
    inputLabel="Topic / Product"
  />
);

export default AIStudioPage;

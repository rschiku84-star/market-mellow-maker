import { Instagram } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const ReelCreatorPage = () => (
  <AIToolLayout
    title="Instagram Reel Creator"
    subtitle="Generate reel ideas, hooks, captions, and hashtags"
    toolId="reel-creator"
    placeholder="e.g. Skincare routine, Budget meal prep, Side hustle ideas..."
    icon={<Instagram className="w-4 h-4" />}
    inputLabel="Enter your reel topic"
  />
);

export default ReelCreatorPage;

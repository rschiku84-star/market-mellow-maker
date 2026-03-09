import { Image } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const ThumbnailIdeasPage = () => (
  <AIToolLayout
    title="Thumbnail Idea Generator"
    subtitle="Get thumbnail text, visual concepts, and color suggestions"
    toolId="thumbnail-ideas"
    placeholder="e.g. How I made $10k in one month, 5 Apps That Pay You Daily, Morning Routine..."
    icon={<Image className="w-4 h-4" />}
    inputLabel="Enter your video title"
  />
);

export default ThumbnailIdeasPage;

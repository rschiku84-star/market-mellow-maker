import { Video } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const VideoGeneratorPage = () => (
  <AIToolLayout
    title="AI Video Generator"
    subtitle="Generate complete video content packages from a topic"
    toolId="video-generator"
    placeholder="e.g. 5 morning habits that changed my life, How to start a side hustle in 2026..."
    icon={<Video className="w-4 h-4" />}
    inputLabel="Enter your video topic"
  />
);

export default VideoGeneratorPage;

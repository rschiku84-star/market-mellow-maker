import { Youtube } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const FacelessYouTubePage = () => (
  <AIToolLayout
    title="Faceless YouTube Video Maker"
    subtitle="Generate complete faceless YouTube video scripts with SEO"
    toolId="faceless-youtube"
    placeholder="e.g. Top 10 AI tools in 2026, History of Ancient Rome, How the stock market works..."
    icon={<Youtube className="w-4 h-4" />}
    inputLabel="Enter your video topic"
  />
);

export default FacelessYouTubePage;

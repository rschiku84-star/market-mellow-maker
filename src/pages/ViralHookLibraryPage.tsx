import { BookOpen } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const ViralHookLibraryPage = () => (
  <AIToolLayout
    title="Viral Hook Library"
    subtitle="Get 50+ proven viral hooks organized by category"
    toolId="viral-hooks"
    placeholder="e.g. Business and entrepreneurship, Health and fitness, Personal development..."
    icon={<BookOpen className="w-4 h-4" />}
    inputLabel="Enter your niche for tailored hooks"
  />
);

export default ViralHookLibraryPage;

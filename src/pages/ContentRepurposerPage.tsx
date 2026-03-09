import { Repeat } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const ContentRepurposerPage = () => (
  <AIToolLayout
    title="Content Repurposer"
    subtitle="Convert long-form content into multiple short-form formats"
    toolId="content-repurposer"
    placeholder="Paste your long-form content here (blog post, article, script, etc.)..."
    icon={<Repeat className="w-4 h-4" />}
    inputLabel="Paste your long-form content"
  />
);

export default ContentRepurposerPage;

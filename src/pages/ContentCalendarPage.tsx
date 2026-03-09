import { CalendarDays } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const ContentCalendarPage = () => (
  <AIToolLayout
    title="Content Calendar Generator"
    subtitle="Generate a 30-day content posting plan"
    toolId="content-calendar"
    placeholder="e.g. Fitness coaching brand posting on TikTok and Instagram..."
    icon={<CalendarDays className="w-4 h-4" />}
    inputLabel="Describe your brand and platforms"
  />
);

export default ContentCalendarPage;

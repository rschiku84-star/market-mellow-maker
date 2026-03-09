import { FileText } from "lucide-react";
import AIToolLayout from "@/components/dashboard/AIToolLayout";

const ScriptConverterPage = () => (
  <AIToolLayout
    title="Script to Shorts Converter"
    subtitle="Convert long scripts into short-form video scripts"
    toolId="script-converter"
    placeholder="Paste your long script or article here..."
    icon={<FileText className="w-4 h-4" />}
    inputLabel="Paste your script"
  />
);

export default ScriptConverterPage;

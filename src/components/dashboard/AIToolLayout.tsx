import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { Copy, Download, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import DashboardHeader from "./DashboardHeader";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

interface AIToolLayoutProps {
  title: string;
  subtitle: string;
  toolId: string;
  placeholder: string;
  icon: ReactNode;
  inputLabel?: string;
  children?: ReactNode;
}

const AIToolLayout = ({ title, subtitle, toolId, placeholder, icon, inputLabel = "Enter your topic or niche" }: AIToolLayoutProps) => {
  const [input, setInput] = useState("");
  const { output, isGenerating, generate, credits } = useAIGeneration();
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (!input.trim()) {
      toast({ title: "Please enter some text", variant: "destructive" });
      return;
    }
    generate(toolId, input.trim());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied to clipboard!" });
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toolId}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <DashboardHeader title={title} subtitle={subtitle} />
      <div className="p-6 max-w-4xl space-y-6">
        {/* Credits display */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          {credits.loading ? (
            "Loading credits..."
          ) : credits.limit !== null ? (
            <span>{credits.remaining} / {credits.limit} credits remaining this month</span>
          ) : (
            <span>Unlimited credits ({credits.plan} plan)</span>
          )}
        </div>

        {/* Input */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <label className="text-sm font-medium text-foreground">{inputLabel}</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              rows={4}
              maxLength={2000}
              disabled={isGenerating}
            />
            <div className="flex items-center gap-3">
              <Button onClick={handleGenerate} disabled={isGenerating || !credits.canGenerate} className="gap-2">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    {icon}
                    Generate
                  </>
                )}
              </Button>
              {!credits.canGenerate && (
                <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/subscription")} className="gap-1 text-destructive">
                  <AlertTriangle className="w-3 h-3" />
                  Upgrade Plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Loading animation */}
        {isGenerating && !output && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 gap-4"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">AI is crafting your content...</p>
          </motion.div>
        )}

        {/* Output */}
        {output && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Generated Content</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1">
                      <Copy className="w-3 h-3" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none text-foreground [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-foreground [&_strong]:text-foreground [&_li]:text-muted-foreground [&_p]:text-muted-foreground [&_ol]:text-muted-foreground">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default AIToolLayout;

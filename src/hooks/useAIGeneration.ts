import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "./useCredits";
import { toast } from "@/hooks/use-toast";

export function useAIGeneration() {
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const credits = useCredits();

  const generate = async (tool: string, input: string) => {
    if (!credits.canGenerate) {
      toast({
        title: "Credit limit reached",
        description: "Upgrade your plan for more AI generations.",
        variant: "destructive",
      });
      return;
    }

    setOutput("");
    setIsGenerating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Please log in", variant: "destructive" });
        setIsGenerating(false);
        return;
      }

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ai-tool`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ tool, input }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Generation failed" }));
        if (err.error === "credit_limit") {
          toast({
            title: "Credits exhausted",
            description: err.message,
            variant: "destructive",
          });
        } else {
          toast({ title: "Error", description: err.error || "Generation failed", variant: "destructive" });
        }
        setIsGenerating(false);
        return;
      }

      // Stream response
      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setOutput(fullText);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      credits.refresh();
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to generate content", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return { output, isGenerating, generate, credits, setOutput };
}

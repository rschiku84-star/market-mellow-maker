import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PLAN_LIMITS: Record<string, number | null> = {
  free: 10,
  pro: null, // unlimited
  premium: null,
  business: null,
};

const TOOL_PROMPTS: Record<string, string> = {
  "video-generator": `You are a viral video content strategist. Given a topic, generate:
1. Video Title (catchy, click-worthy)
2. Full Script (300-500 words, conversational tone)
3. Scene Breakdown (5-8 scenes with visual descriptions)
4. Voiceover Text (matching the script)
5. Suggested Visuals (for each scene)
6. Caption (for social media posting)
7. Hashtags (10-15 relevant hashtags)

Format each section with clear headers using ##.`,

  "viral-ideas": `You are a viral content strategist. Given a niche, generate 12 viral content ideas. For each idea provide:
- Idea title
- Hook (first line to grab attention)
- Caption
- Best platform

Format as a numbered list with clear sub-items.`,

  "hook-generator": `You are a viral hook expert. Generate 10 powerful, scroll-stopping hooks for short-form videos. Each hook should:
- Be under 10 words
- Create curiosity or urgency
- Work for TikTok, Reels, and Shorts

Format as a numbered list.`,

  "caption-generator": `You are a social media caption expert. Generate captions for the given topic/product for these platforms:

## Instagram Caption
(engaging, with line breaks, emojis, and 15 hashtags)

## TikTok Caption
(short, punchy, with 10 hashtags)

## YouTube Shorts Caption
(SEO-friendly description with 8 hashtags)`,

  "script-converter": `You are a short-form video script expert. Convert the provided long script/text into a punchy short-form video script (30-60 seconds). Include:
- Hook (first 3 seconds)
- Body (key points, fast-paced)
- CTA (call to action)
- Visual cues in [brackets]`,

  "tiktok-ideas": `You are a TikTok content strategist. Generate 15 viral TikTok video ideas. For each:
- Video concept title
- Hook (first line)
- Brief description
- Suggested hashtags (5 each)

Format as a numbered list.`,

  "faceless-youtube": `You are a faceless YouTube content expert. Generate:

## Video Title (SEO-optimized, click-worthy)

## Full Script (5-8 minute video, ~1000-1500 words)
Write in a conversational narration style.

## Scene Instructions
List 8-12 scenes with:
- Visual description (stock footage/animation suggestions)
- Duration
- On-screen text suggestions

## Voiceover Script
The complete narration text.

## YouTube SEO
- SEO Title
- Description (with keywords)
- Tags (15-20)`,

  "thumbnail-ideas": `You are a YouTube thumbnail design expert. Generate 5 thumbnail concepts:
For each:
- Main text overlay (3-5 words, bold)
- Visual concept description
- Color palette suggestion (3 colors with hex codes)
- Emotion/expression to convey
- Layout description`,

  "reel-creator": `You are an Instagram Reels expert. Generate:

## Reel Concept
A creative, trending reel idea.

## Hook
The opening line (first 1-2 seconds).

## Script/Flow
Step-by-step flow of the reel (15-30 seconds).

## Caption
Engaging caption with emojis.

## Hashtags
20 relevant hashtags.`,

  "content-repurposer": `You are a content repurposing expert. Take the provided long-form content and convert it into:

## TikTok Script
(30-60 second video script with hook, body, CTA)

## YouTube Shorts Script
(60 second script, slightly more detailed)

## Instagram Caption
(engaging post with emojis and 15 hashtags)

## Twitter/X Thread
(5-7 tweets that tell the story, with a hook tweet first)`,

  "trending-topics": `You are a trend analyst. For the given niche, generate 20 trending content ideas that are currently popular or emerging. For each:
- Topic title
- Why it's trending
- Content angle suggestion
- Best format (video/post/reel)

Format as a numbered list.`,

  "content-calendar": `You are a content planning expert. Generate a 30-day content calendar. For each day provide:
- Day number
- Content type (Reel/TikTok/Post/Short/Story)
- Topic/Title
- Brief description
- Best time to post

Format as a structured daily plan.`,

  "viral-hooks": `You are a viral marketing expert. Generate a library of 50 proven viral hooks organized by category:

## Question Hooks (10)
## Controversial/Bold Hooks (10)
## Story Hooks (10)
## Curiosity Gap Hooks (10)
## Number/List Hooks (10)

Each hook should be ready to use, under 15 words.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { tool, input } = await req.json();
    if (!tool || !TOOL_PROMPTS[tool]) {
      return new Response(JSON.stringify({ error: "Invalid tool" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check credits
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    const plan = profile?.plan ?? "free";
    const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

    if (limit !== null) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("ai_generations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth.toISOString());

      if ((count ?? 0) >= limit) {
        return new Response(
          JSON.stringify({ error: "credit_limit", message: "You've reached your monthly generation limit. Upgrade your plan for more credits." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Call AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = TOOL_PROMPTS[tool];
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Record the generation
    await supabase.from("ai_generations").insert({
      user_id: user.id,
      tool_name: tool,
      title: input.substring(0, 200),
    });

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-ai-tool error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

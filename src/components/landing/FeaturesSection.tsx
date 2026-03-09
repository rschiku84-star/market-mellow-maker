import { motion } from "framer-motion";
import { Video, Lightbulb, Zap, MessageSquare, FileText, Music, Youtube, Image, Instagram, Repeat, TrendingUp, CalendarDays, BookOpen } from "lucide-react";

const tools = [
  { icon: Video, title: "AI Video Generator", desc: "Full video scripts, scene breakdowns & hashtags" },
  { icon: Lightbulb, title: "Viral Idea Generator", desc: "10-15 viral content ideas for any niche" },
  { icon: Zap, title: "Hook Generator", desc: "10 scroll-stopping hooks per generation" },
  { icon: MessageSquare, title: "Caption Generator", desc: "Platform-specific captions with emojis & hashtags" },
  { icon: FileText, title: "Script Converter", desc: "Long scripts to short-form video scripts" },
  { icon: Music, title: "TikTok Ideas", desc: "15 viral TikTok video ideas with hooks" },
  { icon: Youtube, title: "Faceless YouTube", desc: "Full 5-8 min scripts with SEO optimization" },
  { icon: Image, title: "Thumbnail Ideas", desc: "Text, visuals & color suggestions" },
  { icon: Instagram, title: "Reel Creator", desc: "Reel ideas, hooks, captions & hashtags" },
  { icon: Repeat, title: "Content Repurposer", desc: "Convert to TikTok, Shorts, captions & threads" },
  { icon: TrendingUp, title: "Trending Topics", desc: "20 trending ideas in your niche" },
  { icon: CalendarDays, title: "Content Calendar", desc: "30-day posting plan generated instantly" },
  { icon: BookOpen, title: "Viral Hook Library", desc: "100 proven viral hooks by category" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            13 AI-powered tools
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 mb-4 text-foreground">
            Everything you need to <span className="text-gradient-primary">go viral</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From hooks to full video scripts — generate any content type in seconds with AI.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.title}
              variants={item}
              className="group relative p-5 rounded-xl bg-card border border-border card-glow hover:card-hover-glow transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-primary group-hover:scale-110 transition-transform">
                <tool.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-display font-semibold text-card-foreground mb-1">{tool.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;

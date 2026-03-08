import { motion } from "framer-motion";
import { Upload, Sparkles, Share2, BarChart3, Video, FileText } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Product Upload",
    description: "Upload your products with images, descriptions, and pricing in seconds. Bulk import supported.",
    color: "text-primary",
  },
  {
    icon: Sparkles,
    title: "AI Ad Generator",
    description: "Instantly create scroll-stopping ad copy tailored to your brand voice and target audience.",
    color: "text-accent",
  },
  {
    icon: Video,
    title: "AI Video Scripts",
    description: "Generate professional video scripts for TikTok, Reels, and YouTube Shorts automatically.",
    color: "text-primary",
  },
  {
    icon: FileText,
    title: "Smart Descriptions",
    description: "AI writes compelling product descriptions that convert browsers into buyers.",
    color: "text-accent",
  },
  {
    icon: Share2,
    title: "Social Posting",
    description: "Schedule and publish to multiple social platforms from one unified dashboard.",
    color: "text-primary",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track views, clicks, and conversions with real-time insights to optimize your strategy.",
    color: "text-accent",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
            Everything you need
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 mb-4 text-foreground">
            One platform, <span className="text-gradient-primary">infinite possibilities</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From product upload to viral social posts — CreatorHub handles it all with the power of AI.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative p-8 rounded-2xl bg-card border border-border card-glow hover:card-hover-glow transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 ${feature.color} group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;

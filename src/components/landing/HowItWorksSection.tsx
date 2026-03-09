import { motion } from "framer-motion";
import { Upload, Sparkles, Share2 } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Product",
    description:
      "Add your product details, images, price and description in under 60 seconds. No technical skills required.",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "AI Creates the Content",
    description:
      "Our AI instantly generates ad copy, video scripts, social captions and promotional reels tailored to your product.",
    color: "from-accent/20 to-accent/5",
    iconColor: "text-accent-foreground",
  },
  {
    step: "03",
    icon: Share2,
    title: "Post & Watch Sales Grow",
    description:
      "Share directly to Instagram, TikTok, WhatsApp and more. Track performance from your analytics dashboard.",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Simple 3-step process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 mb-4 text-foreground">
            From product to viral post{" "}
            <span className="text-gradient-primary">in minutes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No design experience needed. No video editing software. Just your product and our AI.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2 w-[calc(66%-4rem)] h-0.5 bg-gradient-to-r from-primary/30 via-accent/40 to-primary/30" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step circle */}
                <div
                  className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} border border-border flex items-center justify-center mb-6 shadow-lg`}
                >
                  <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border card-glow">
            <div className="flex -space-x-2">
              {["🎯", "🔥", "💰"].map((emoji, i) => (
                <span
                  key={i}
                  className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-sm"
                >
                  {emoji}
                </span>
              ))}
            </div>
            <p className="text-sm text-foreground font-medium">
              Creators generate their first content in{" "}
              <span className="text-primary font-bold">under 3 minutes</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

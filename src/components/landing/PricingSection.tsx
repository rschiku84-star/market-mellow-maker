import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Free",
    price: "Free",
    period: "",
    description: "Get started with AI content",
    features: [
      "5 AI generations / month",
      "All 13 AI tools",
      "Copy & download outputs",
      "Content history",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For growing creators",
    features: [
      "50 AI generations / month",
      "All 13 AI tools",
      "Copy & download outputs",
      "Content history",
      "Priority support",
      "Early access to new tools",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Premium",
    price: "$49",
    period: "/month",
    description: "Unlimited content creation",
    features: [
      "Unlimited AI generations",
      "All 13 AI tools",
      "Copy & download outputs",
      "Content history",
      "Priority support",
      "Early access to new tools",
      "API access",
      "Custom branding",
    ],
    cta: "Go Premium",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-muted/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Simple pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 mb-4 text-foreground">
            Plans that <span className="text-gradient-primary">scale with you</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free with 5 generations per month. Upgrade when you're ready.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-2xl p-8 ${
                tier.popular
                  ? "bg-secondary text-secondary-foreground border-2 border-primary scale-105"
                  : "bg-card text-card-foreground border border-border"
              } card-glow hover:card-hover-glow transition-all duration-300`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> Most Popular
                </div>
              )}

              <h3 className="text-xl font-display font-semibold">{tier.name}</h3>
              <p className={`text-sm mt-1 ${tier.popular ? "text-secondary-foreground/70" : "text-muted-foreground"}`}>
                {tier.description}
              </p>

              <div className="flex items-baseline gap-1 mt-6 mb-6">
                <span className="text-4xl font-display font-bold">{tier.price}</span>
                {tier.period && (
                  <span className={`text-sm ${tier.popular ? "text-secondary-foreground/60" : "text-muted-foreground"}`}>
                    {tier.period}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 flex-shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="w-full"
                variant={tier.popular ? "default" : "outline"}
                size="lg"
              >
                <Link to="/signup">{tier.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

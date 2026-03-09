import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "What is CreatorHub?",
    a: "CreatorHub is an AI-powered content creation platform with 13+ tools to help creators generate viral videos, hooks, captions, scripts, and more — all from one dashboard.",
  },
  {
    q: "How does the credit system work?",
    a: "Each AI generation uses 1 credit. Free users get 5 credits/month, Pro gets 50, and Premium gets unlimited. Credits reset at the start of each billing month.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes! You can cancel your subscription at any time. Your access continues until the end of your current billing period.",
  },
  {
    q: "What AI tools are included?",
    a: "Video Generator, Viral Idea Generator, Hook Generator, Caption Generator, Script Converter, TikTok Ideas, Faceless YouTube, Thumbnail Ideas, Reel Creator, Content Repurposer, Trending Topics, Content Calendar, and Viral Hook Library.",
  },
  {
    q: "Do I own the generated content?",
    a: "Yes! Everything you generate with CreatorHub is yours to use however you like — commercially, on social media, or anywhere else.",
  },
  {
    q: "Is there a free trial?",
    a: "Our Free plan gives you 5 generations per month forever — no credit card required. You can upgrade to Pro or Premium when you need more.",
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-muted/20 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mt-3 mb-4 text-foreground">
            Frequently asked <span className="text-gradient-primary">questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left bg-card border border-border rounded-xl p-5 hover:card-hover-glow transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-foreground pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                  />
                </div>
                {open === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-muted-foreground text-sm mt-3 leading-relaxed"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

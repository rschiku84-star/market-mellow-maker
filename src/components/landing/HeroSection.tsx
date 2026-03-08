import { motion } from "framer-motion";
import { ArrowRight, Play, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-hero overflow-hidden flex items-center">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm mb-6"
            >
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-secondary-foreground">AI-powered commerce for creators</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              <span className="text-secondary-foreground">Turn your products into</span>
              <br />
              <span className="text-gradient-primary">viral content</span>
              <span className="text-secondary-foreground"> in seconds</span>
            </h1>

            <p className="text-lg text-secondary-foreground/70 max-w-lg mb-8 leading-relaxed">
              Upload your products, let AI generate stunning ads, scripts & videos.
              Post to social media and watch your sales grow — all from one dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base gap-2 px-8 shadow-lg shadow-primary/25">
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-base gap-2 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 mt-10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-secondary bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary-foreground">2,400+ creators</p>
                <p className="text-xs text-secondary-foreground/50">already growing with CreatorHub</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-[60px]" />
              <img
                src={heroImg}
                alt="Creator managing their shop with AI tools"
                className="relative w-full max-w-lg mx-auto drop-shadow-2xl"
              />
            </div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 -left-4 glass rounded-xl px-4 py-3"
            >
              <p className="text-xs font-semibold text-secondary-foreground">🎯 Ad Generated</p>
              <p className="text-xs text-secondary-foreground/60">+340% engagement</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 -right-4 glass rounded-xl px-4 py-3"
            >
              <p className="text-xs font-semibold text-secondary-foreground">📈 Sales up 180%</p>
              <p className="text-xs text-secondary-foreground/60">This month</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

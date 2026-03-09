import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Sparkles, Target, Users, Zap } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              About <span className="text-gradient-primary">CreatorHub</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to empower creators and small businesses with AI-powered tools to produce stunning marketing content effortlessly.
            </p>
          </div>

          <div className="space-y-12">
            <section className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                CreatorHub was built to democratize video marketing. We believe every creator and entrepreneur deserves access to professional-quality marketing tools — without the steep learning curve or high costs. Our AI-powered platform turns your product images and ideas into scroll-stopping video ads in minutes, not days.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground">What We Do</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                From image-to-reel conversion to AI-generated scripts and automated social media scheduling, CreatorHub is your all-in-one content creation studio. We leverage cutting-edge AI to help you create, manage, and distribute marketing content across all your channels.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground">Who It's For</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're a solo creator selling handmade goods, an e-commerce entrepreneur scaling your brand, or a social media manager juggling multiple clients — CreatorHub gives you the tools to produce professional content at scale.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground">Our Values</h2>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Simplicity — Powerful tools that anyone can use.</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Accessibility — Professional marketing shouldn't require a professional budget.</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Innovation — We push the boundaries of AI to deliver real results.</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">•</span> Community — We grow when our creators grow.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;

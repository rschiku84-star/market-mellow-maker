import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="py-12 bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-secondary-foreground">
              CreatorHub
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-secondary-foreground/60">
            <Link to="/about" className="hover:text-secondary-foreground transition-colors">About</Link>
            <Link to="/contact" className="hover:text-secondary-foreground transition-colors">Contact</Link>
            <Link to="/privacy" className="hover:text-secondary-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-secondary-foreground transition-colors">Terms</Link>
          </div>

          <p className="text-sm text-secondary-foreground/40">
            © 2026 CreatorHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;

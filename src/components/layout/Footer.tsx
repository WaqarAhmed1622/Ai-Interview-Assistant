import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface/50 border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-5 h-5 fill-white/20" />
              </div>
              <span className="font-bold text-lg text-white">Interview Copilot</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Ace your next interview with real-time AI assistance.
              Privacy-focused, secure, and undetectable.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-white mb-6">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/features" className="text-slate-400 hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-slate-400 hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/how-it-works" className="text-slate-400 hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link to="/extension" className="text-slate-400 hover:text-primary transition-colors">Chrome Extension</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-slate-400 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-slate-400 hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="text-slate-400 hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy" className="text-slate-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-400 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookie" className="text-slate-400 hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Interview Copilot. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Operational
          </div>
        </div>
      </div>
    </footer>
  );
}

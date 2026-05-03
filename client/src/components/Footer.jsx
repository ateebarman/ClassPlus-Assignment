import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Heart, ArrowRight, LayoutGrid } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#030014] border-t border-white/5 pt-20 pb-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-500/5 blur-[120px] rounded-full -z-10"></div>

      <div className="container mx-auto px-6 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 items-start">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">Wishes<span className="text-brand-400">App</span></span>
            </div>
            <p className="text-white/40 max-w-xs font-medium leading-relaxed mx-auto">
              Elevate your greetings with our premium AI-powered studio. Create, personalize, and share stunning wishes in seconds.
            </p>
            <div className="flex items-center justify-center gap-4">
              <SocialLink icon={<Star className="w-5 h-5" />} href="#" />
              <SocialLink icon={<LayoutGrid className="w-5 h-5" />} href="#" />
              <SocialLink icon={<Sparkles className="w-5 h-5" />} href="#" />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="footer-link inline-block">Browse Templates</Link></li>
              <li><Link to="/create" className="footer-link inline-block">Custom Studio</Link></li>
              <li><Link to="/premium" className="footer-link inline-block">Premium Plans</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold">Support</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="footer-link inline-block">Help Center</Link></li>
              <li><Link to="#" className="footer-link inline-block">Privacy Policy</Link></li>
              <li><Link to="#" className="footer-link inline-block">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-sm font-bold tracking-widest uppercase">
            © 2026 WishesApp. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-white/20 text-sm font-bold">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>by Ateeb Arman</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;

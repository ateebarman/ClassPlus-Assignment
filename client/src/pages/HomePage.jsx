import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Search, Crown, ArrowRight, LayoutGrid, Clock, Star, Plus } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import TemplateCard from '../components/TemplateCard';
import CategoryFilter from '../components/CategoryFilter';
import PremiumModal from '../components/PremiumModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const categories = ['All', 'Birthday', 'Anniversary', 'Festival', 'Shayari', 'Quotes'];

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/templates', {
          params: {
            category: activeCategory === 'All' ? '' : activeCategory,
            search
          }
        });
        setTemplates(data.templates);
      } catch (err) {
        console.error('Failed to fetch templates');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchTemplates, 300);
    return () => clearTimeout(timer);
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {/* Hero Section */}
        <section className="mb-16 flex flex-col md:flex-row items-center justify-between gap-12 animate-fade-in">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 rounded-full border border-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              New Spring Collection Out Now
            </div>
            <h2 className="text-6xl md:text-8xl font-black font-display text-gradient leading-[0.85] tracking-tighter">
              Personalized <br /> Magic, Instantly.
            </h2>
            <p className="text-xl text-white/50 leading-relaxed font-medium">
              Choose a professional template or build your own masterpiece from scratch using our new Custom Studio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                to="/create"
                className="btn-premium btn-premium-primary py-5 px-10 text-lg hover-shine shadow-glow-purple inline-flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create from Scratch
              </Link>
              <button 
                onClick={() => document.getElementById('browse').scrollIntoView({ behavior: 'smooth' })}
                className="btn-premium btn-premium-secondary py-5 px-10 text-lg"
              >
                Browse Templates
              </button>
            </div>
          </div>

          <div className="hidden lg:block relative group">
            <div className="absolute inset-0 bg-brand-500/20 blur-[100px] rounded-full group-hover:bg-brand-500/30 transition-all duration-700"></div>
            <div className="w-64 h-80 bg-white/5 border border-white/10 rounded-[3rem] p-6 relative z-10 rotate-6 group-hover:rotate-0 transition-transform duration-500 glass-panel">
              <div className="w-full h-48 bg-brand-600/20 rounded-2xl mb-4 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400" alt="Preview" className="w-full h-full object-cover opacity-60" />
              </div>
              <div className="space-y-2">
                <div className="w-3/4 h-3 bg-white/20 rounded-full"></div>
                <div className="w-1/2 h-3 bg-white/10 rounded-full"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </section>

        <div id="browse" className="scroll-mt-24">
          {/* Dashboard Actions */}
          <div className="flex flex-col lg:flex-row gap-8 mb-12 items-end">
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  Browse Templates
                </h3>
                <div className="flex items-center gap-4 text-xs font-bold text-white/20">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Latest</span>
                  <span className="flex items-center gap-1 text-brand-400"><Star className="w-3 h-3" /> Trending</span>
                </div>
              </div>
              
              <CategoryFilter 
                categories={categories} 
                active={activeCategory} 
                onChange={setActiveCategory} 
              />
            </div>

            <div className="relative group min-w-[320px] w-full lg:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by event or style..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand-500/50 focus:bg-white/10 transition-all text-sm font-bold text-white placeholder:text-white/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Template Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-3xl bg-white/5 animate-pulse border border-white/5"></div>
              ))}
            </div>
          ) : templates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
              {templates.map(template => (
                <TemplateCard key={template._id} template={template} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 glass-panel rounded-[3rem] border-dashed border-white/10">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white/10" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">No matching templates</h4>
              <p className="text-white/40 font-medium">Try searching for something else or change the category.</p>
            </div>
          )}
        </div>

        {/* Premium CTA */}
        {!user?.isPremium && (
          <section className="mt-24 p-1 rounded-[3rem] bg-gradient-to-r from-brand-600 via-pink-500 to-amber-500 shadow-2xl shadow-brand-500/20 group overflow-hidden">
            <div className="bg-[#0a0118] rounded-[2.9rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
              
              <div className="space-y-8 relative z-10 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <Crown className="w-3 h-3" />
                  Limited Pro Access
                </div>
                <h3 className="text-5xl md:text-6xl font-black font-display text-white leading-tight">
                  Unlock Your <br /> Full Potential.
                </h3>
                <p className="text-white/50 text-xl max-w-lg leading-relaxed">
                  Get 4K HD exports, remove all watermarks, and access 500+ exclusive premium templates today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    onClick={() => setShowPremiumModal(true)}
                    className="btn-premium btn-premium-primary py-5 px-12 text-lg hover-shine shadow-glow-purple"
                  >
                    Go Pro for ₹99
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="px-8 py-5 text-white/40 font-bold hover:text-white transition-colors">
                    View Features
                  </button>
                </div>
              </div>

              <div className="relative group/img max-w-[440px]">
                <div className="absolute inset-0 bg-brand-500/20 blur-[80px] rounded-full group-hover/img:bg-brand-500/40 transition-all duration-700"></div>
                <div className="relative z-10 transform rotate-6 group-hover/img:rotate-0 transition-transform duration-700 ease-out">
                  <img 
                    src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80" 
                    alt="Premium Preview" 
                    className="rounded-[2.5rem] shadow-2xl border border-white/10"
                  />
                  <div className="absolute -bottom-6 -left-6 glass-panel p-4 rounded-2xl border-brand-500/30 flex items-center gap-3 animate-bounce shadow-2xl">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Star className="text-emerald-500 w-5 h-5 fill-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase">User Rating</p>
                      <p className="text-sm font-bold text-white">4.9/5 Masterpieces</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      <Footer />
    </div>
  );
};

export default HomePage;

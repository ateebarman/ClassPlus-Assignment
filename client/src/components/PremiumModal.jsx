import React from 'react';
import { X, Crown, Check, Zap, Image as ImageIcon, ShieldCheck } from 'lucide-react';

const PremiumModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box w-[90%] max-w-lg glass-strong p-8 rounded-3xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-3xl -mr-20 -mt-20"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 glass rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/50" />
        </button>

        <div className="text-center space-y-6">
          <div className="inline-flex p-4 rounded-3xl bg-amber-500/20 mb-2">
            <Crown className="w-10 h-10 text-amber-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-display">Wishes<span className="text-amber-500">Premium</span></h2>
            <p className="text-white/50">Unlock your full creative potential</p>
          </div>

          <div className="space-y-4 py-4">
            <FeatureItem icon={<ImageIcon className="w-5 h-5" />} text="200+ Premium Templates" />
            <FeatureItem icon={<Zap className="w-5 h-5" />} text="No Watermarks & HD Export" />
            <FeatureItem icon={<ShieldCheck className="w-5 h-5" />} text="Ad-free Experience" />
          </div>

          <div className="space-y-4 pt-4">
            <button className="btn w-full py-4 bg-amber-500 text-black font-extrabold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform">
              Get Started — ₹99/month
            </button>
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/30">
              7 days free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, text }) => (
  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
    <div className="text-amber-500">{icon}</div>
    <span className="font-medium text-sm text-white/80">{text}</span>
    <Check className="w-4 h-4 text-emerald-500 ml-auto" />
  </div>
);

export default PremiumModal;

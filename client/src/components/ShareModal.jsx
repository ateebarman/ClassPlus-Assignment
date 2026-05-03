import React, { useState } from 'react';
import { 
  X, Send, Camera, Mail, 
  MessageCircle, Copy, Check, Share2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { exportCanvasAsBlob } from '../utils/canvasEngine';

const ShareModal = ({ isOpen, onClose, canvas }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleNativeShare = async () => {
    if (!canvas) return;
    
    try {
      const blob = await exportCanvasAsBlob(canvas);
      const file = new File([blob], 'greeting.png', { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Personalized Greeting',
          text: 'Created using WishesApp!',
        });
        onClose();
      } else {
        toast.error('Native sharing not supported on this device');
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const copyToClipboard = () => {
    // Note: Copying images to clipboard is complex across browsers, 
    // usually we copy the app link or a text representation
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    toast.success('App link copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box w-[90%] max-w-sm glass-strong p-8 rounded-3xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 glass rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/50" />
        </button>

        <div className="text-center space-y-6">
          <div className="inline-flex p-4 rounded-2xl bg-brand-500/20 mb-2">
            <Share2 className="w-8 h-8 text-brand-400" />
          </div>
          
          <h3 className="text-2xl font-bold font-display">Share Wish</h3>
          
          <div className="grid grid-cols-4 gap-4 py-4">
            <ShareOption 
              icon={<MessageCircle className="w-6 h-6" />} 
              label="WhatsApp" 
              color="bg-emerald-500" 
              onClick={() => window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent('Check out this personalized greeting I made! ' + window.location.href))}
            />
            <ShareOption 
              icon={<Camera className="w-6 h-6" />} 
              label="Stories" 
              color="bg-pink-600" 
              onClick={() => toast('Save image and upload to Instagram!')}
            />
            <ShareOption 
              icon={<Mail className="w-6 h-6" />} 
              label="Email" 
              color="bg-blue-500" 
              onClick={() => window.location.href = `mailto:?subject=Personalized Greeting&body=Check out this greeting: ${window.location.href}`}
            />
            <ShareOption 
              icon={<Send className="w-6 h-6" />} 
              label="Native" 
              color="bg-brand-500" 
              onClick={handleNativeShare}
            />
          </div>

          <div className="pt-4">
            <button 
              onClick={copyToClipboard}
              className="w-full flex items-center justify-between p-4 glass rounded-2xl border border-white/5 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <Copy className="w-4 h-4 text-white/40" />
                <span className="text-sm font-medium">Copy App Link</span>
              </div>
              {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4"></div>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShareOption = ({ icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 group"
  >
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</span>
  </button>
);

export default ShareModal;

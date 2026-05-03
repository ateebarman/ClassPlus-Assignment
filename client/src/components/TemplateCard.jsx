import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, ArrowRight } from 'lucide-react';
import { renderPreview } from '../utils/canvasEngine';

const TemplateCard = ({ template, user }) => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (canvasRef.current && template) {
      renderPreview(canvasRef.current, template, user);
    }
  }, [template, user]);

  return (
    <div 
      onClick={() => navigate(`/template/${template._id}`)}
      className="group glass-card cursor-pointer animate-scale-in"
    >
      {/* Live Canvas Preview */}
      <div className="aspect-[2/3] w-full bg-surface-900 relative overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <div className="flex items-center justify-between translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-sm font-bold text-white truncate mr-2">{template.title}</span>
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center shadow-lg">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none">
        {template.isPremium && (
          <div className="bg-amber-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-black shadow-xl flex items-center gap-1 animate-pulse">
            <Crown className="w-3 h-3" />
            Premium
          </div>
        )}
        <div className="bg-white/10 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full border border-white/10">
          {template.category}
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, Share2, Crown, 
  Type, RefreshCw, Send, 
  Camera, Mail, MessageCircle, Sparkles, Star,
  Layers as LayersIcon, Sliders, Palette, Plus, Trash2, UserIcon, UserCheck, Move
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { renderDynamicCanvas, exportCanvasAsBlob } from '../utils/canvasEngine';
import PremiumModal from '../components/PremiumModal';
import ShareModal from '../components/ShareModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TemplatePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const canvasRef = useRef(null);

  // Editor State (Matching Custom Studio)
  const [activeTab, setActiveTab] = useState('layers'); // layers, controls
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const { data } = await api.get(`/templates/${id}`);
        setTemplate(data.template);
        
        // Initialize layers from template config
        const initialLayers = [];
        const config = data.template.overlayConfig;

        if (config?.avatar?.enabled) {
          initialLayers.push({
            id: 'avatar-main',
            type: 'avatar',
            enabled: true,
            xPercent: config.avatar.xPercent,
            yPercent: config.avatar.yPercent,
            sizePercent: config.avatar.sizePercent,
            borderColor: config.avatar.borderColor,
            borderWidth: config.avatar.borderWidth
          });
        }

        if (config?.nameBanner?.enabled) {
          initialLayers.push({
            id: 'name-main',
            type: 'name',
            enabled: true,
            xPercent: 50,
            yPercent: config.nameBanner.yPercent + 4,
            fontSize: config.nameBanner.fontSize * 1.2,
            color: config.nameBanner.color,
            align: 'center',
            fontWeight: '900',
            shadow: true
          });
        }

        if (config?.textOverlay?.enabled) {
          initialLayers.push({
            id: 'text-extra',
            type: 'text',
            enabled: true,
            text: config.textOverlay.text,
            xPercent: config.textOverlay.xPercent,
            yPercent: config.textOverlay.yPercent,
            fontSize: config.textOverlay.fontSize,
            color: config.textOverlay.color,
            align: config.textOverlay.align,
            shadow: config.textOverlay.shadow,
            fontWeight: 'bold'
          });
        }

        setLayers(initialLayers);
        if (initialLayers.length > 0) setSelectedLayerId(initialLayers[0].id);

        if (data.template.isPremium && !user?.isPremium) {
          setShowPremiumModal(true);
        }
      } catch (err) {
        toast.error('Template not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id, user, navigate]);

  useEffect(() => {
    if (canvasRef.current && template) {
      renderDynamicCanvas(canvasRef.current, {
        backgroundUrl: template.imageUrl,
        layers,
        user
      });
    }
  }, [template, layers, user]);

  const addTextLayer = () => {
    const newLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      enabled: true,
      text: 'Happy Birthday!',
      xPercent: 50,
      yPercent: 50,
      fontSize: 40,
      color: '#ffffff',
      align: 'center',
      shadow: true
    };
    setLayers([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
    setActiveTab('controls');
  };

  const updateLayer = (id, updates) => {
    setLayers(layers.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const removeLayer = (id) => {
    setLayers(layers.filter(l => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  const handleDownload = async () => {
    if (template?.isPremium && !user?.isPremium) {
      return setShowPremiumModal(true);
    }
    setIsExporting(true);
    try {
      const blob = await exportCanvasAsBlob(canvasRef.current);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.title.replace(/\s+/g, '_')}_personalized.png`;
      link.click();
      toast.success('Downloaded!');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center mesh-bg">
      <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030014]">
      <Navbar />
      
      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-80px)]">
        {/* Workspace */}
        <div className="flex-1 p-6 md:p-12 flex flex-col gap-6 bg-white/[0.02] overflow-y-auto">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors font-bold"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Editing Template</span>
                <h3 className="text-sm font-bold text-white">{template.title}</h3>
              </div>
              <div className="px-4 py-2 bg-brand-500/10 rounded-full border border-brand-500/20 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span className="text-xs font-black uppercase tracking-widest text-white">Smart Editor</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <div className="canvas-glow shadow-2xl relative group">
              <canvas 
                ref={canvasRef} 
                className="max-h-[70vh] w-auto max-w-full block transition-transform duration-500 rounded-2xl"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <button onClick={handleDownload} disabled={isExporting} className="btn-premium btn-premium-secondary py-4 px-8">
              {isExporting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Download className="w-5 h-5" /> Download</>}
            </button>
            <button 
              onClick={() => {
                if (template?.isPremium && !user?.isPremium) {
                  setShowPremiumModal(true);
                } else {
                  setShowShareModal(true);
                }
              }} 
              className="btn-premium btn-premium-primary py-4 px-8"
            >
              <Share2 className="w-5 h-5" /> Share
            </button>
          </div>
        </div>

        {/* Sidebar Controls (Matching Custom Studio) */}
        <div className="w-full lg:w-[450px] glass-panel flex flex-col border-l border-white/5">
          <div className="flex border-b border-white/5">
            {[
              { id: 'layers', icon: <LayersIcon className="w-4 h-4" />, label: 'Layers Stack' },
              { id: 'controls', icon: <Sliders className="w-4 h-4" />, label: 'Customize Styles' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-2 py-6 transition-all border-b-2 ${
                  activeTab === tab.id ? 'border-brand-500 bg-white/5 text-white' : 'border-transparent text-white/30 hover:text-white/60'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {activeTab === 'layers' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Canvas Layers</h3>
                  <button onClick={addTextLayer} className="p-2 bg-brand-500 rounded-lg text-white hover:scale-110 transition-transform">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {layers.map(layer => (
                    <div 
                      key={layer.id}
                      onClick={() => setSelectedLayerId(layer.id)}
                      className={`p-5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                        selectedLayerId === layer.id ? 'bg-brand-500/10 border-brand-500/50' : 'bg-white/5 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${selectedLayerId === layer.id ? 'bg-brand-500 text-white' : 'bg-white/10 text-white/40'}`}>
                          {layer.type === 'text' ? <Type className="w-4 h-4" /> : layer.type === 'name' ? <UserCheck className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">{layer.type}</p>
                          <p className="text-sm font-bold text-white truncate max-w-[150px]">{layer.type === 'text' ? layer.text : layer.type === 'name' ? 'Auto-Name' : 'Profile Picture'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
                        className="p-2 text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'controls' && selectedLayer && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-brand-400">Position & Style</h3>
                </div>

                <div className="space-y-6">
                  {selectedLayer.type === 'text' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Message Content</label>
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-brand-500/50"
                        value={selectedLayer.text}
                        onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
                        rows={2}
                      />
                    </div>
                  )}

                  {selectedLayer.type === 'name' && (
                    <div className="p-4 bg-brand-500/10 rounded-xl border border-brand-500/20">
                      <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-2">Smart Identity</p>
                      <p className="text-xs text-white/60 font-medium">Synced with your profile name: <span className="text-white font-bold">{user?.name}</span></p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest flex justify-between">
                      Vertical Position <span>{selectedLayer.yPercent}%</span>
                    </label>
                    <input 
                      type="range" min="0" max="100" 
                      className="w-full accent-brand-500" 
                      value={selectedLayer.yPercent}
                      onChange={(e) => updateLayer(selectedLayer.id, { yPercent: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest flex justify-between">
                      Horizontal Position <span>{selectedLayer.xPercent}%</span>
                    </label>
                    <input 
                      type="range" min="0" max="100" 
                      className="w-full accent-brand-500" 
                      value={selectedLayer.xPercent}
                      onChange={(e) => updateLayer(selectedLayer.id, { xPercent: parseInt(e.target.value) })}
                    />
                  </div>

                  {(selectedLayer.type === 'text' || selectedLayer.type === 'name') && (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Font Size</label>
                        <input 
                          type="number" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white font-bold"
                          value={selectedLayer.fontSize}
                          onChange={(e) => updateLayer(selectedLayer.id, { fontSize: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Color</label>
                        <input 
                          type="color" 
                          className="w-full h-[46px] bg-white/5 border border-white/10 rounded-xl p-1 cursor-pointer"
                          value={selectedLayer.color}
                          onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {selectedLayer.type === 'avatar' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-white/30 tracking-widest flex justify-between">
                        Avatar Size <span>{selectedLayer.sizePercent}%</span>
                      </label>
                      <input 
                        type="range" min="5" max="40" 
                        className="w-full accent-brand-500" 
                        value={selectedLayer.sizePercent}
                        onChange={(e) => updateLayer(selectedLayer.id, { sizePercent: parseInt(e.target.value) })}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {!selectedLayer && activeTab === 'controls' && (
              <div className="py-20 text-center">
                <Move className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/30 font-bold">Select a layer to adjust styles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} canvas={canvasRef.current} />
      <Footer />
    </div>
  );
};

export default TemplatePage;

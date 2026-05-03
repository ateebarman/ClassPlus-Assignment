import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Download, Share2, Type, 
  Image as ImageIcon, User as UserIcon, 
  Layers, Palette, Plus, Trash2, 
  Move, Sliders, Sparkles, UserCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { renderDynamicCanvas, exportCanvasAsBlob } from '../utils/canvasEngine';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import ShareModal from '../components/ShareModal';
import Footer from '../components/Footer';

const STARTER_BGS = [
  // Vibrant Gradients
  { id: 1, url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80', name: 'Royal Purple' },
  { id: 2, url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80', name: 'Liquid Sunset' },
  { id: 7, url: 'https://images.unsplash.com/photo-1558478551-1a378f63ad28?w=800&q=80', name: 'Azure Dream' },
  { id: 8, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', name: 'Abstract Flow' },
  
  // Festive & Textures
  { id: 3, url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80', name: 'Dark Texture' },
  { id: 4, url: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80', name: 'Golden Festive' },
  { id: 9, url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80', name: 'Glitter Gold' },
  { id: 10, url: 'https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?w=800&q=80', name: 'Silk Red' },
  
  // Nature & Scenic
  { id: 5, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', name: 'Rose Petals' },
  { id: 6, url: 'https://images.unsplash.com/photo-1470252649358-96f3c802b4b9?w=800&q=80', name: 'Morning Mist' },
  { id: 11, url: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&q=80', name: 'Mountain Peak' },
  { id: 12, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', name: 'Ocean Calm' },
  
  // Minimal & Modern
  { id: 13, url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80', name: 'Clean Desk' },
  { id: 14, url: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80', name: 'Geometric' },
  { id: 15, url: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=800&q=80', name: 'Soft Bokeh' },
  { id: 16, url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80', name: 'Oil Paint' },
];

const CustomEditorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Editor State
  const [background, setBackground] = useState(STARTER_BGS[0].url);
  const [activeTab, setActiveTab] = useState('bg'); // bg, layers, styles
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  
  const [layers, setLayers] = useState([
    { 
      id: 'avatar-1', 
      type: 'avatar', 
      enabled: true, 
      xPercent: 5, 
      yPercent: 5, 
      sizePercent: 15, 
      borderColor: '#8b5cf6', 
      borderWidth: 4 
    },
    { 
      id: 'name-1', 
      type: 'name', 
      enabled: true, 
      xPercent: 50, 
      yPercent: 85, 
      fontSize: 32, 
      color: '#ffffff', 
      align: 'center',
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: '900',
      shadow: true
    },
    { 
      id: 'text-1', 
      type: 'text', 
      enabled: true, 
      text: 'HAPPY CELEBRATION', 
      xPercent: 50, 
      yPercent: 70, 
      fontSize: 60, 
      color: '#ffffff', 
      align: 'center',
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: 'bold',
      shadow: true
    }
  ]);

  useEffect(() => {
    if (canvasRef.current) {
      renderDynamicCanvas(canvasRef.current, {
        backgroundUrl: background,
        layers,
        user
      });
    }
  }, [background, layers, user]);

  const addTextLayer = () => {
    const newLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      enabled: true,
      text: 'New Wish',
      xPercent: 50,
      yPercent: 50,
      fontSize: 40,
      color: '#ffffff',
      align: 'center',
      shadow: true
    };
    setLayers([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
    setActiveTab('layers');
  };

  const addNameLayer = () => {
    const newLayer = {
      id: `name-${Date.now()}`,
      type: 'name',
      enabled: true,
      xPercent: 50,
      yPercent: 90,
      fontSize: 30,
      color: '#ffffff',
      align: 'center',
      fontWeight: '900',
      shadow: true
    };
    setLayers([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
    setActiveTab('layers');
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
    try {
      const blob = await exportCanvasAsBlob(canvasRef.current);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'custom_greeting.png';
      link.click();
      toast.success('Downloaded!');
    } catch (err) {
      toast.error('Download failed');
    }
  };

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
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-500/10 rounded-full border border-brand-500/20">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-black uppercase tracking-widest text-white">Custom Studio</span>
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
            <button onClick={handleDownload} className="btn-premium btn-premium-secondary py-4 px-8">
              <Download className="w-5 h-5" /> Download
            </button>
            <button onClick={() => setShowShareModal(true)} className="btn-premium btn-premium-primary py-4 px-8">
              <Share2 className="w-5 h-5" /> Share
            </button>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="w-full lg:w-[450px] glass-panel flex flex-col border-l border-white/5">
          {/* Tabs Navigation */}
          <div className="flex border-b border-white/5">
            {[
              { id: 'bg', icon: <ImageIcon className="w-4 h-4" />, label: 'Background' },
              { id: 'layers', icon: <Layers className="w-4 h-4" />, label: 'Layers' },
              { id: 'styles', icon: <Sliders className="w-4 h-4" />, label: 'Controls' }
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
            {activeTab === 'bg' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-sm font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Select Base
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {STARTER_BGS.map(bg => (
                    <div 
                      key={bg.id}
                      onClick={() => setBackground(bg.url)}
                      className={`aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        background === bg.url ? 'border-brand-500 scale-[1.02] shadow-lg shadow-brand-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'layers' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Layers Stack</h3>
                  <div className="flex gap-2">
                    <button onClick={addNameLayer} title="Add Name" className="p-2 bg-pink-500 rounded-lg text-white hover:scale-110 transition-transform">
                      <UserCheck className="w-4 h-4" />
                    </button>
                    <button onClick={addTextLayer} title="Add Message" className="p-2 bg-brand-500 rounded-lg text-white hover:scale-110 transition-transform">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
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

            {activeTab === 'styles' && selectedLayer && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-brand-400">Layer Settings</h3>
                  <span className="text-[10px] font-bold text-white/20">ID: {selectedLayerId}</span>
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
                      <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-2">Smart Layer</p>
                      <p className="text-xs text-white/60 font-medium">This layer automatically displays your profile name: <span className="text-white font-bold">{user?.name}</span></p>
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

            {!selectedLayer && activeTab === 'styles' && (
              <div className="py-20 text-center">
                <Move className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/30 font-bold">Select a layer to adjust styles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} canvas={canvasRef.current} />
      <Footer />
    </div>
  );
};

export default CustomEditorPage;

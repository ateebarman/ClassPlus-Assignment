import React, { useState } from 'react';
import { Camera, Sparkles, ArrowRight, User as UserIcon, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const OnboardingPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicUrl || '');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Please enter your name');
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (image) formData.append('profilePic', image);

      const { data } = await api.patch('/auth/onboarding', formData);
      
      // Use setUser instead of updateProfile
      setUser(data.user);
      
      toast.success('Profile ready!');
      navigate('/');
    } catch (err) {
      console.error('Onboarding failed:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 mesh-bg">
      <div className="premium-orb orb-1 opacity-40"></div>
      
      <div className="w-full max-w-xl relative animate-scale-in">
        <div className="glass-panel p-10 md:p-14 rounded-[3.5rem] space-y-10">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-black font-display text-gradient">Set the Stage.</h1>
            <p className="text-white/40 font-medium">Add your photo and name to personalize templates.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Image Upload */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="w-36 h-36 rounded-[2.5rem] overflow-hidden border-2 border-dashed border-white/20 group-hover:border-brand-500/50 transition-all p-1">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-[2.2rem]" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center text-white/20 gap-2">
                      <Camera className="w-8 h-8" />
                      <span className="text-[10px] font-black uppercase">Upload</span>
                    </div>
                  )}
                </div>
                
                <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 transition-transform border-4 border-surface-900">
                  <Camera className="w-5 h-5 text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Profile Picture</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-400 uppercase tracking-widest ml-1">Your Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 outline-none focus:border-brand-500/50 focus:bg-white/10 transition-all font-bold text-lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={uploading}
                className="btn-premium btn-premium-primary w-full py-5 text-lg hover-shine shadow-glow-purple"
              >
                {uploading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Complete Setup
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-surface-900 bg-surface-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Joined by 10k+ users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;

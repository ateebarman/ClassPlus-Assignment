import React from 'react';
import { Sparkles, LogOut, User as UserIcon, Crown, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-white">
            Wishes<span className="text-brand-400">App</span>
          </h1>
        </Link>
        
        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Engine Online</span>
          </div>

          <div className="flex items-center gap-4 border-l border-white/10 pl-4 md:pl-8">
            <button className="p-2 text-white/40 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Premium User</p>
                <p className="text-sm font-bold text-white">{user?.name}</p>
              </div>
              
              <div 
                className="w-10 h-10 rounded-full border-2 border-brand-500 p-0.5 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate('/onboarding')}
              >
                <img 
                  src={user?.profilePicUrl || 'https://ui-avatars.com/api/?name=' + user?.name} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover" 
                />
              </div>

              <button 
                onClick={logout}
                className="p-2.5 bg-white/5 hover:bg-red-500/10 border border-white/5 rounded-xl transition-all text-white/40 hover:text-red-500"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

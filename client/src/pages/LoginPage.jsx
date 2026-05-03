import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Globe, 
  User as UserIcon, 
  ArrowRight, 
  Mail, 
  Lock,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loginMode, setLoginMode] = useState('email'); // email, guest
  const [loading, setLoading] = useState(false);
  
  const { loginWithEmail, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  // The API URL should ideally come from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async (e) => {
    e.preventDefault();
    if (!guestName.trim()) return toast.error('Please enter a name');
    setLoading(true);
    try {
      await loginAsGuest(guestName);
      toast.success(`Welcome, ${guestName}!`);
      navigate('/onboarding');
    } catch (err) {
      toast.error('Guest login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Correct endpoint is /api/auth/google
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-y-auto">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[#030014]">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md animate-scale-in">
        <div className="glass-panel p-8 rounded-[2rem] border border-white/5 space-y-6 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-brand-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-500/20 rotate-12">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <div className="text-center pt-6">
            <h1 className="text-3xl font-black font-display text-white mb-2">Welcome</h1>
            <p className="text-white/40 font-medium text-sm">Choose your way to start creating</p>
          </div>

          {/* Login Modes Tabs */}
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setLoginMode('email')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                loginMode === 'email' ? 'bg-white/10 text-white shadow-xl' : 'text-white/30 hover:text-white/60'
              }`}
            >
              Email
            </button>
            <button 
              onClick={() => setLoginMode('guest')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                loginMode === 'guest' ? 'bg-white/10 text-white shadow-xl' : 'text-white/30 hover:text-white/60'
              }`}
            >
              Guest
            </button>
          </div>

          {loginMode === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-4">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-400 transition-colors" />
                  <input 
                    type="email" 
                    required
                    placeholder="name@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-brand-500/50 focus:bg-white/10 transition-all text-white font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-4">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-400 transition-colors" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-brand-500/50 focus:bg-white/10 transition-all text-white font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-premium btn-premium-primary py-4 text-base shadow-glow-purple group mt-2"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Logging in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleGuestLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-4">Your Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-400 transition-colors" />
                  <input 
                    type="text" 
                    required
                    placeholder="Enter name to explore..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-brand-500/50 focus:bg-white/10 transition-all text-white font-bold"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-premium btn-premium-secondary py-4 text-base group mt-2"
              >
                {loading ? 'Entering...' : 'Explore Now'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]"><span className="bg-[#0b031a] px-4 text-white/20">OR</span></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full py-3 px-6 glass rounded-xl border border-white/5 flex items-center justify-center gap-3 hover:bg-white/10 transition-all group"
          >
            <Globe className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-bold text-white/80">Continue with Google</span>
          </button>

          <div className="pt-4 text-center">
            <p className="text-white/30 font-bold text-sm">
              Don't have an account? {' '}
              <Link to="/signup" className="text-brand-400 hover:text-brand-300 transition-colors">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

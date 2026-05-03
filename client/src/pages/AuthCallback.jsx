import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Fixed: Use setUser instead of non-existent login function

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const onboarding = searchParams.get('onboarding') === 'true';

      if (token) {
        try {
          console.log('Authentication token received, fetching user profile...');
          // Store token first so api.get('/auth/me') can use it
          localStorage.setItem('token', token);
          
          const { data } = await api.get('/auth/me');
          
          // Update auth state
          setUser(data.user);
          
          toast.success('Logged in successfully!');
          
          if (onboarding) {
            navigate('/onboarding');
          } else {
            navigate('/');
          }
        } catch (err) {
          console.error('OAuth Callback Error:', err);
          toast.error('Authentication failed during profile sync');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        console.warn('No token found in callback URL');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white/60 font-medium animate-pulse">Completing authentication...</p>
    </div>
  );
};

export default AuthCallback;

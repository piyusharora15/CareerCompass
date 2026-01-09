import React, { useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallbackPage = () => {
  const { login, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const hasCalledLogin = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token && !hasCalledLogin.current) {
      hasCalledLogin.current = true;
      
      const handleAuth = async () => {
        try {
          // 1. Process login and wait for user data to be fetched in context
          await login(token);
          
          // 2. Note: We don't navigate yet, we let the 'user' dependency below handle it
          // once the context state is updated.
        } catch (err) {
          console.error("Auth Callback Error:", err);
          navigate('/login', { replace: true });
        }
      };

      handleAuth();
    } else if (!token) {
      navigate('/login', { replace: true });
    }
  }, [location, login, navigate]);

  // Handle the redirect once the user data is available in context
  useEffect(() => {
    if (user) {
      // Logic Updated: Checking for onboarding status
      if (!user.careerProfile || !user.careerProfile.industry) {
        // FLAT URL: Redirecting to /onboarding
        navigate('/onboarding', { replace: true });
      } else {
        // FLAT URL: Redirecting to /insights (Primary Feature)
        navigate('/insights', { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white">
      <div className="bg-[#1e293b] p-10 rounded-[2.5rem] border border-slate-800 flex flex-col items-center shadow-2xl">
        <Loader2 className="animate-spin text-blue-500 mb-6" size={48} />
        <h2 className="text-xl font-black uppercase tracking-widest text-white">
          Securing <span className="text-blue-500">Session</span>
        </h2>
        <p className="text-slate-500 text-sm mt-2">Syncing your career profile...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
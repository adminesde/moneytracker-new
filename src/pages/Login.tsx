import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../utils/toast';
import { useTheme } from '../context/ThemeContext';

const Login: React.FC = () => {
  const { session, isLoading } = useSession();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (session && !isLoading) {
      navigate('/');
    }
  }, [session, isLoading, navigate]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    if (savedRememberMe && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rememberMe', String(rememberMe));
  }, [rememberMe]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Error logging in:', error);
      showError(`Gagal masuk: ${error.message}`);
    }
    setIsSubmitting(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      console.error('Error resetting password:', error);
      showError(`Gagal mereset kata sandi: ${error.message}`);
    } else {
      showSuccess('Link reset kata sandi telah dikirim ke email Anda!');
      setIsForgotPasswordMode(false);
      setForgotPasswordEmail('');
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        Memuat...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-900 dark:to-gray-800 p-4 relative overflow-hidden">
      <div className="absolute w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob top-0 left-0"></div>
      <div className="absolute w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 bottom-0 right-0"></div>
      <div className="absolute w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 backdrop-filter backdrop-blur-lg bg-opacity-70 dark:bg-opacity-70">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 rounded-full shadow-xl border-4 border-white dark:border-gray-900">
          <User size={40} className="text-white" />
        </div>

        <h1 className="text-3xl font-bold text-center mb-8 mt-8 text-emerald-600 dark:text-emerald-400">
          {isForgotPasswordMode ? 'Reset Kata Sandi' : 'Selamat Datang!'}
        </h1>

        {!isForgotPasswordMode ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">Email ID</label>
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <div className="p-4 bg-gray-200 dark:bg-gray-600">
                  <Mail size={20} className="text-gray-600 dark:text-gray-300" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Email ID"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <div className="p-4 bg-gray-200 dark:bg-gray-600">
                  <Lock size={20} className="text-gray-600 dark:text-gray-300" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center text-gray-700 dark:text-gray-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-4 w-4 text-emerald-600 rounded border-gray-300 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-gray-200 dark:bg-gray-700 mr-2" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordMode(true)}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <div className="relative w-full h-16">
              <div className="absolute inset-x-0 bottom-0 h-14 bg-emerald-700 dark:bg-emerald-900 rounded-2xl shadow-inner"></div>
              <button
                type="submit"
                className="absolute inset-x-0 top-0 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Masuk...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="w-full text-emerald-600 dark:text-emerald-400 hover:underline mt-4 font-medium"
            >
              Belum punya akun? Daftar
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
              Masukkan email Anda untuk menerima link reset kata sandi.
            </p>
            <div>
              <label htmlFor="forgot-email" className="sr-only">Email ID</label>
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <div className="p-4 bg-gray-200 dark:bg-gray-600">
                  <Mail size={20} className="text-gray-600 dark:text-gray-300" />
                </div>
                <input
                  type="email"
                  id="forgot-email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Email ID"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Mengirim...</span>
                </>
              ) : (
                <span>Kirim Link Reset</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsForgotPasswordMode(false)}
              className="w-full text-emerald-600 dark:text-emerald-400 hover:underline mt-4 font-medium"
            >
              Kembali ke Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../utils/toast';
import { useSession } from '../context/SessionContext';

const SignUp: React.FC = () => {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session && !isLoading) {
      navigate('/');
    }
  }, [session, isLoading, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password.length < 6) {
      showError('Kata sandi harus minimal 6 karakter.');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      showError('Konfirmasi kata sandi tidak cocok.');
      setIsSubmitting(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: '',
          last_name: '',
        }
      }
    });

    if (error) {
      console.error('Error signing up:', error);
      showError(`Gagal mendaftar: ${error.message}`);
    } else if (data.user) {
      showSuccess('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
      navigate('/login');
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
          Daftar Akun Baru
        </h1>

        <form onSubmit={handleSignUp} className="space-y-6">
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
                className="flex-1 px-4 py-3 pr-0 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Kata Sandi (min. 6 karakter)"
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

          <div>
            <label htmlFor="confirm-password" className="sr-only">Konfirmasi Kata Sandi</label>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
              <div className="p-4 bg-gray-200 dark:bg-gray-600">
                <Lock size={20} className="text-gray-600 dark:text-gray-300" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 px-4 py-3 pr-0 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Konfirmasi Kata Sandi"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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
                  <span>Mendaftar...</span>
                </>
              ) : (
                <span>Daftar</span>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full text-emerald-600 dark:text-emerald-400 hover:underline mt-4 font-medium"
          >
            Sudah punya akun? Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
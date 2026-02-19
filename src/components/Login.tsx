
import React, { useState } from 'react';
import { api } from '../services/api';

interface LoginProps {
  onLogin: (role: 'victim' | 'official') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'victim' | 'official'>('victim');
  const [aadhaar, setAadhaar] = useState('');
  const [beneficiaryPassword, setBeneficiaryPassword] = useState('');
  const [officialId, setOfficialId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDigiLockerLoading, setIsDigiLockerLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validation
      if (selectedRole === 'victim') {
        if (!aadhaar || !/^\d{12}$/.test(aadhaar.replace(/-/g, ''))) {
          setError('Please enter a valid 12-digit Aadhaar number');
          setIsLoading(false);
          return;
        }
        if (!beneficiaryPassword || beneficiaryPassword.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }

        // Call backend API
        await api.loginVictim(aadhaar.replace(/-/g, ''), beneficiaryPassword);
        onLogin(selectedRole);
      } else {
        if (!officialId || officialId.trim().length < 3) {
          setError('Please enter your official ID');
          setIsLoading(false);
          return;
        }
        if (!password || password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }

        // Call backend API
        await api.loginOfficial(officialId, password);
        onLogin(selectedRole);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  const handleDigiLockerLogin = async () => {
    setError('');
    setIsDigiLockerLoading(true);

    // Simulate DigiLocker authentication
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsDigiLockerLoading(false);
    // In a real implementation, this would redirect to DigiLocker OAuth
    // For now, we'll simulate successful authentication
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2rem] mb-6 shadow-2xl shadow-indigo-500/30">
            <i className="fa-solid fa-scale-balanced text-white text-3xl"></i>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-3">SAMARTH</h1>
          <p className="text-slate-400 font-medium text-sm uppercase tracking-[0.2em]">DBT Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-[3rem] shadow-2xl border border-white/20">
          {/* Role Selection */}
          <div className="flex gap-3 mb-8 p-1.5 bg-slate-100 rounded-2xl">
            <button
              onClick={() => {
                setSelectedRole('victim');
                setError('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                selectedRole === 'victim'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <i className={`fa-solid ${selectedRole === 'victim' ? 'fa-user-shield' : 'fa-user'} mr-2`}></i>
              Beneficiary
            </button>
            <button
              onClick={() => {
                setSelectedRole('official');
                setError('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                selectedRole === 'official'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <i className={`fa-solid ${selectedRole === 'official' ? 'fa-briefcase' : 'fa-briefcase'} mr-2`}></i>
              Official
            </button>
          </div>

          {/* DigiLocker Sign In Option */}
          {selectedRole === 'victim' && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleDigiLockerLogin}
                disabled={isDigiLockerLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-4"
              >
                {isDigiLockerLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connecting to DigiLocker...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wallet text-lg"></i>
                    Sign In with DigiLocker
                  </>
                )}
              </button>
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-slate-300"></div>
                <span className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-slate-300"></div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {selectedRole === 'victim' ? (
              <>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    <i className="fa-solid fa-fingerprint mr-2 text-indigo-600"></i>
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(formatAadhaar(e.target.value))}
                    placeholder="XXXX-XXXX-XXXX"
                    maxLength={14}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-bold text-lg tracking-wider placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    <i className="fa-solid fa-lock mr-2 text-indigo-600"></i>
                    Password
                  </label>
                  <input
                    type="password"
                    value={beneficiaryPassword}
                    onChange={(e) => setBeneficiaryPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-bold text-lg placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    <i className="fa-solid fa-id-card mr-2 text-indigo-600"></i>
                    Official ID
                  </label>
                  <input
                    type="text"
                    value={officialId}
                    onChange={(e) => setOfficialId(e.target.value)}
                    placeholder="Enter your official ID"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-bold text-lg placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    <i className="fa-solid fa-lock mr-2 text-indigo-600"></i>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-bold text-lg placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black text-sm uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <i className="fa-solid fa-shield-halved text-indigo-600"></i>
              <span className="font-bold">Secure Authentication</span>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2 font-medium">
              Your data is protected with end-to-end encryption
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-xs font-medium">
            Need help? Contact support at{' '}
            <a href="tel:14566" className="text-indigo-400 hover:text-indigo-300 font-bold">
              14566
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

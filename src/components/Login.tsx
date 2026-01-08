
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (role: 'victim' | 'official') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'victim' | 'official'>('victim');

  const handleLogin = () => {
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <div className="bg-slate-800 p-10 rounded-3xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-black text-white tracking-tight text-center mb-8">Select Your Role</h2>
        <div className="space-y-4">
          <button
            onClick={() => setSelectedRole('victim')}
            className={`w-full p-4 rounded-xl text-lg font-bold transition-all ${
              selectedRole === 'victim' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            Beneficiary
          </button>
          <button
            onClick={() => setSelectedRole('official')}
            className={`w-full p-4 rounded-xl text-lg font-bold transition-all ${
              selectedRole === 'official' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            Official
          </button>
        </div>
        <button
          onClick={handleLogin}
          className="w-full mt-8 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl transition-all"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { ShieldCheck, Music2, ArrowLeft, KeyRound, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/Button';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

// Pequeno componente de Logo Quadrangular
const FoursquareLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const dim = size === "sm" ? "w-2 h-2" : size === "lg" ? "w-6 h-6" : "w-4 h-4";
  return (
    <div className="grid grid-cols-2 gap-0.5 transform rotate-0">
      <div className={`${dim} bg-red-600 rounded-tl-[2px]`} title="Jesus Salva"></div>
      <div className={`${dim} bg-yellow-400 rounded-tr-[2px]`} title="Jesus Batiza"></div>
      <div className={`${dim} bg-blue-600 rounded-bl-[2px]`} title="Jesus Cura"></div>
      <div className={`${dim} bg-purple-700 rounded-br-[2px]`} title="Jesus Voltará"></div>
    </div>
  );
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isDarkMode, toggleTheme }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'ADMIN') {
      if (password === 'admin123') {
        onLogin('ADMIN');
      } else {
        setError('Senha incorreta.');
      }
    } else if (selectedRole === 'MUSICIAN') {
      if (password === 'louvor123') {
        onLogin('MUSICIAN');
      } else {
        setError('Senha incorreta.');
      }
    }
  };

  const resetSelection = () => {
    setSelectedRole(null);
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
        
        {/* Toggle Theme Absolute */}
        {toggleTheme && (
            <button 
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 text-gray-500 dark:text-gray-400 z-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
            >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
        )}

        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 dark:opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 dark:opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-yellow-100 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 dark:opacity-10 animate-blob animation-delay-4000"></div>

        <div className="text-center mb-10 z-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <FoursquareLogo size="lg" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Portal do Louvor</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Selecione seu perfil de acesso</p>
        </div>

        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
          <button
            onClick={() => setSelectedRole('ADMIN')}
            className="group relative bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-md border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800/50 hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="w-24 h-24 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="bg-purple-50 dark:bg-slate-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-7 h-7 text-purple-700 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Liderança</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Gestão de escalas, escolha de repertório e administração do culto.
            </p>
            <div className="mt-6 flex items-center text-purple-700 dark:text-purple-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                Acessar Painel &rarr;
            </div>
          </button>

          <button
            onClick={() => setSelectedRole('MUSICIAN')}
            className="group relative bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-md border-2 border-transparent hover:border-yellow-200 dark:hover:border-yellow-800/50 hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Music2 className="w-24 h-24 text-yellow-500" />
            </div>
            <div className="bg-yellow-50 dark:bg-slate-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Music2 className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Músicos</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Acesso rápido às cifras, letras e ordem do culto ao vivo.
            </p>
            <div className="mt-6 flex items-center text-yellow-700 dark:text-yellow-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                Ver Escala &rarr;
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 relative overflow-hidden transition-colors">
        {/* Top Color Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 flex">
            <div className="w-1/4 bg-red-600"></div>
            <div className="w-1/4 bg-yellow-400"></div>
            <div className="w-1/4 bg-blue-600"></div>
            <div className="w-1/4 bg-purple-700"></div>
        </div>

        <button 
            onClick={resetSelection}
            className="flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white mb-8 text-sm transition-colors group"
        >
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Voltar
        </button>

        <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-sm transition-colors ${
                selectedRole === 'ADMIN' 
                ? 'bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-400' 
                : 'bg-yellow-50 dark:bg-slate-800 text-yellow-600 dark:text-yellow-400'
            }`}>
                {selectedRole === 'ADMIN' ? <ShieldCheck className="w-10 h-10" /> : <Music2 className="w-10 h-10" />}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {selectedRole === 'ADMIN' ? 'Liderança' : 'Músicos'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Informe a senha de acesso</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <KeyRound className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-gray-900 dark:text-white dark:placeholder-gray-500"
                        placeholder="Senha"
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400"></span>
                    {error}
                </div>
            )}

            <Button type="submit" className="w-full py-3.5 text-base shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-0.5 transition-all" variant="primary">
                Acessar Sistema
            </Button>

            <div className="text-center pt-2">
                 <p className="text-xs text-gray-400 dark:text-gray-600">
                    Dica: {selectedRole === 'ADMIN' ? 'admin123' : 'louvor123'}
                 </p>
            </div>
        </form>
      </div>
    </div>
  );
};
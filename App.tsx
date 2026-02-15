import React, { useState, useEffect } from 'react';
import { Settings, MonitorPlay, LogOut, Sun, Moon } from 'lucide-react';
import { Service, ViewMode, UserRole } from './types';
import { AdminPanel } from './components/AdminPanel';
import { LiveView } from './components/LiveView';
import { LoginScreen } from './components/LoginScreen';

const STORAGE_KEY = 'church_worship_data_v1';
const THEME_KEY = 'church_theme_v1';

const defaultService: Service = {
  id: '1',
  title: 'Culto de Celebração',
  date: new Date().toISOString().split('T')[0],
  team: [],
  songs: [],
  note: ''
};

// Componente do Logo interno
const FoursquareLogoSmall = () => (
    <div className="grid grid-cols-2 gap-px transform rotate-45 mr-3">
      <div className="w-1.5 h-1.5 bg-red-600 rounded-tl-[1px]"></div>
      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-tr-[1px]"></div>
      <div className="w-1.5 h-1.5 bg-blue-600 rounded-bl-[1px]"></div>
      <div className="w-1.5 h-1.5 bg-purple-700 rounded-br-[1px]"></div>
    </div>
);

function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ADMIN);
  const [service, setService] = useState<Service>(defaultService);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Theme Logic
  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(THEME_KEY, 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setService(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(service));
  }, [service]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'MUSICIAN') {
      setViewMode(ViewMode.LIVE);
    } else {
      setViewMode(ViewMode.ADMIN);
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setViewMode(ViewMode.ADMIN);
  };

  if (!userRole) {
    return <LoginScreen onLogin={handleLogin} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  // Se for Live View (sempre escuro por natureza, mas mantemos o controle se necessário)
  if (viewMode === ViewMode.LIVE) {
      return (
          <div className="h-screen flex flex-col bg-slate-900">
              {/* Barra minimalista para sair do modo live */}
              {userRole === 'ADMIN' && (
                  <div className="bg-slate-900 border-b border-slate-800 p-2 flex justify-between items-center px-4">
                      <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">Modo Apresentação</span>
                      <button 
                        onClick={() => setViewMode(ViewMode.ADMIN)}
                        className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
                      >
                          <Settings className="w-3 h-3" /> Voltar ao Admin
                      </button>
                  </div>
              )}
              {/* Se for musico, barra de logout minimalista */}
              {userRole === 'MUSICIAN' && (
                   <div className="bg-slate-900 border-b border-slate-800 p-2 flex justify-end px-4">
                      <button 
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-red-400 text-xs flex items-center gap-1 uppercase font-bold tracking-wider"
                      >
                          <LogOut className="w-3 h-3" /> Sair
                      </button>
                   </div>
              )}
              <div className="flex-1 overflow-hidden">
                  <LiveView service={service} />
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-slate-900 sticky top-0 z-50 shadow-sm border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 via-yellow-400 to-blue-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-xl mr-3 border border-gray-100 dark:border-slate-700">
                 <FoursquareLogoSmall />
              </div>
              <div className="flex flex-col">
                  <span className="font-bold text-lg text-gray-900 dark:text-white leading-none tracking-tight">Gestor de Louvor</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold tracking-widest uppercase mt-0.5">
                      Igreja do Evangelho Quadrangular
                  </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400 transition-colors"
                title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
              >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>

              <span className="hidden md:inline-flex px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-100 dark:border-purple-800/50">
                  {userRole === 'ADMIN' ? 'Painel do Líder' : 'Acesso Músico'}
              </span>

              {userRole === 'ADMIN' && (
                <button
                    onClick={() => setViewMode(ViewMode.LIVE)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <MonitorPlay className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="hidden sm:inline">Modo Tela</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full overflow-y-auto custom-scrollbar">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Painel Administrativo</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Organize a excelência do culto.</p>
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500 bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
                   {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
            </div>
            <AdminPanel service={service} setService={setService} />
        </div>
      </main>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { Plus, Trash2, Search, Music, Users, Calendar, ArrowUp, ArrowDown, Wand2, Mic2, Guitar, Drum } from 'lucide-react';
import { Service, Song, Musician, LoadingState } from '../types';
import { fetchSongDetails, suggestSetlist } from '../services/geminiService';
import { Button } from './ui/Button';

interface AdminPanelProps {
  service: Service;
  setService: React.Dispatch<React.SetStateAction<Service>>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ service, setService }) => {
  const [songQuery, setSongQuery] = useState('');
  const [loadingSong, setLoadingSong] = useState(LoadingState.IDLE);
  const [newMusicianName, setNewMusicianName] = useState('');
  const [newMusicianRole, setNewMusicianRole] = useState('Voz');
  const [suggestionTheme, setSuggestionTheme] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleUpdateService = (field: keyof Service, value: any) => {
    setService(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMusician = () => {
    if (!newMusicianName.trim()) return;
    const newMusician: Musician = {
      id: crypto.randomUUID(),
      name: newMusicianName,
      role: newMusicianRole
    };
    handleUpdateService('team', [...service.team, newMusician]);
    setNewMusicianName('');
  };

  const handleRemoveMusician = (id: string) => {
    handleUpdateService('team', service.team.filter(m => m.id !== id));
  };

  const handleSearchSong = async () => {
    if (!songQuery.trim()) return;
    setLoadingSong(LoadingState.LOADING);
    try {
      const songData = await fetchSongDetails(songQuery);
      const newSong: Song = { ...songData, id: crypto.randomUUID() };
      handleUpdateService('songs', [...service.songs, newSong]);
      setSongQuery('');
      setLoadingSong(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoadingSong(LoadingState.ERROR);
    }
  };

  const handleGetSuggestions = async () => {
      if(!suggestionTheme) return;
      setLoadingSuggestions(true);
      const res = await suggestSetlist(suggestionTheme);
      setSuggestions(res);
      setLoadingSuggestions(false);
  }

  const handleRemoveSong = (id: string) => {
    handleUpdateService('songs', service.songs.filter(s => s.id !== id));
  };

  const moveSong = (index: number, direction: 'up' | 'down') => {
    const newSongs = [...service.songs];
    if (direction === 'up' && index > 0) {
      [newSongs[index], newSongs[index - 1]] = [newSongs[index - 1], newSongs[index]];
    } else if (direction === 'down' && index < newSongs.length - 1) {
      [newSongs[index], newSongs[index + 1]] = [newSongs[index + 1], newSongs[index]];
    }
    handleUpdateService('songs', newSongs);
  };

  // Helper para ícones de roles
  const getRoleIcon = (role: string) => {
      const r = role.toLowerCase();
      if (r.includes('voz') || r.includes('back')) return <Mic2 className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      if (r.includes('bateria')) return <Drum className="w-4 h-4 text-red-600 dark:text-red-400" />;
      return <Guitar className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Info Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden group transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 dark:bg-purple-900/20 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 relative z-10">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg text-purple-700 dark:text-purple-300">
                <Calendar className="w-5 h-5" /> 
            </div>
            Dados do Culto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Nome do Evento</label>
            <input
              type="text"
              value={service.title}
              onChange={(e) => handleUpdateService('title', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white transition-all outline-none"
              placeholder="Ex: Culto da Família"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Data do Culto</label>
            <input
              type="date"
              value={service.date}
              onChange={(e) => handleUpdateService('date', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white transition-all outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Team Management - Coluna menor */}
        <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 h-full transition-colors">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                        <Users className="w-5 h-5" />
                    </div>
                    Músicos e Ministros
                </h2>
                
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl mb-6 border border-gray-100 dark:border-slate-700">
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            value={newMusicianName}
                            onChange={(e) => setNewMusicianName(e.target.value)}
                            placeholder="Nome do integrante"
                            className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-yellow-500 text-sm"
                        />
                        <div className="flex gap-2">
                            <select
                                value={newMusicianRole}
                                onChange={(e) => setNewMusicianRole(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-yellow-500 text-sm"
                            >
                                <option value="Voz">Voz</option>
                                <option value="Violão">Violão</option>
                                <option value="Teclado">Teclado</option>
                                <option value="Bateria">Bateria</option>
                                <option value="Baixo">Baixo</option>
                                <option value="Guitarra">Guitarra</option>
                            </select>
                            <Button onClick={handleAddMusician} variant="secondary" className="bg-white dark:bg-slate-700 hover:bg-yellow-50 dark:hover:bg-slate-600 border-gray-200 dark:border-slate-600 text-yellow-700 dark:text-yellow-400">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {service.team.length === 0 && <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">Ninguém escalado ainda.</p>}
                    {service.team.map((musician) => (
                    <div key={musician.id} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-sm hover:border-yellow-200 dark:hover:border-yellow-800 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/30 transition-colors">
                                {getRoleIcon(musician.role)}
                            </div>
                            <div>
                                <span className="block font-semibold text-gray-900 dark:text-gray-200 text-sm">{musician.name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{musician.role}</span>
                            </div>
                        </div>
                        <button onClick={() => handleRemoveMusician(musician.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 p-2">
                        <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Songs Management - Coluna maior */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <Music className="w-5 h-5" />
                </div>
                Repertório
            </h2>

            {/* AI Search Box - Estilo Google */}
            <div className="mb-8">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={songQuery}
                        onChange={(e) => setSongQuery(e.target.value)}
                        placeholder="Pesquisar música (ex: Porque Ele Vive - Harpa)"
                        className="w-full pl-12 pr-32 py-4 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-full shadow-sm focus:ring-0 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchSong()}
                    />
                    <div className="absolute right-2 top-2">
                        <Button 
                            onClick={handleSearchSong} 
                            isLoading={loadingSong === LoadingState.LOADING}
                            disabled={!songQuery}
                            className="rounded-full px-6"
                        >
                            {loadingSong === LoadingState.LOADING ? '' : 'Adicionar'}
                        </Button>
                    </div>
                </div>
                {loadingSong === LoadingState.ERROR && (
                    <p className="mt-2 text-red-500 text-sm px-4">Falha ao buscar. Tente novamente.</p>
                )}
            </div>
            
            {/* AI Suggestion */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/50 p-4 rounded-xl border border-blue-100 dark:border-slate-700 mb-6">
                 <div className="flex items-center gap-2 mb-3">
                     <Wand2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                     <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Assistente de Repertório</p>
                 </div>
                 <div className="flex gap-2">
                    <input 
                        className="flex-1 px-3 py-2 text-sm border border-white dark:border-slate-600 bg-white/80 dark:bg-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 outline-none dark:text-white"
                        placeholder="Tema (ex: Santa Ceia, Páscoa)"
                        value={suggestionTheme}
                        onChange={(e) => setSuggestionTheme(e.target.value)}
                    />
                    <button 
                        onClick={handleGetSuggestions}
                        disabled={loadingSuggestions || !suggestionTheme}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 shadow-sm disabled:opacity-50"
                    >
                        {loadingSuggestions ? 'Pensando...' : 'Sugerir'}
                    </button>
                 </div>
                 {suggestions.length > 0 && (
                     <div className="mt-3 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                         {suggestions.map((s, i) => (
                             <button 
                                key={i} 
                                onClick={() => setSongQuery(s)}
                                className="text-xs bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full border border-purple-100 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-300 hover:shadow-sm transition-all"
                             >
                                {s}
                             </button>
                         ))}
                     </div>
                 )}
            </div>

            <div className="space-y-3">
              {service.songs.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-xl">
                      <Music className="w-12 h-12 text-gray-200 dark:text-slate-700 mx-auto mb-2" />
                      <p className="text-gray-400 dark:text-gray-500 text-sm">O repertório está vazio.</p>
                  </div>
              )}
              {service.songs.map((song, index) => (
                <div key={song.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm group hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all">
                  <div className="flex-1 flex gap-4">
                    <div className="flex flex-col items-center justify-center w-8 pt-1">
                        <span className="text-gray-300 dark:text-slate-600 font-mono text-sm group-hover:text-blue-500 font-bold">{index + 1}</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{song.title}</h3>
                        <div className="flex gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400 items-center">
                            <span className="font-medium text-gray-600 dark:text-gray-300">{song.artist}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600"></span>
                            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold border border-blue-100 dark:border-blue-800/50">
                                {song.key}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{song.bpm} bpm</span>
                        </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-4 justify-end border-t sm:border-t-0 border-gray-100 dark:border-slate-700 pt-3 sm:pt-0">
                      <div className="flex gap-1">
                          <button 
                              onClick={() => moveSong(index, 'up')}
                              disabled={index === 0}
                              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg disabled:opacity-30"
                          >
                              <ArrowUp className="w-4 h-4" />
                          </button>
                          <button 
                              onClick={() => moveSong(index, 'down')}
                              disabled={index === service.songs.length - 1}
                              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg disabled:opacity-30"
                          >
                              <ArrowDown className="w-4 h-4" />
                          </button>
                      </div>
                    <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>
                    <button 
                      onClick={() => handleRemoveSong(song.id)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
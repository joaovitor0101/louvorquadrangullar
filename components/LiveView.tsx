import React, { useState } from 'react';
import { Service } from '../types';
import { Music, Menu, X, Clock, Mic2 } from 'lucide-react';

interface LiveViewProps {
  service: Service;
}

export const LiveView: React.FC<LiveViewProps> = ({ service }) => {
  const [selectedSongIndex, setSelectedSongIndex] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentSong = service.songs[selectedSongIndex];

  return (
    <div className="flex h-full bg-[#0f172a] text-gray-100 overflow-hidden relative font-sans">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden absolute top-4 right-4 z-50 p-3 bg-blue-600 rounded-full text-white shadow-xl hover:bg-blue-500 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <div className={`
        absolute md:relative z-40 w-80 h-full bg-[#1e293b] border-r border-[#334155] flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-[#334155] bg-[#0f172a]">
          <h2 className="text-lg font-bold text-white mb-1 leading-tight">{service.title || "Culto"}</h2>
          <div className="flex items-center text-blue-400 text-xs font-mono gap-2 mt-2">
             <Clock className="w-3 h-3" />
             <span>{service.date ? new Date(service.date).toLocaleDateString('pt-BR') : "--/--/----"}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="py-4">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-6">Setlist</h3>
            <div className="space-y-1">
              {service.songs.map((song, idx) => {
                  const isActive = selectedSongIndex === idx;
                  return (
                    <button
                    key={song.id}
                    onClick={() => {
                        setSelectedSongIndex(idx);
                        setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left px-6 py-4 transition-all flex items-center gap-4 border-l-4 ${
                        isActive 
                        ? 'bg-[#334155] border-yellow-500 text-white' 
                        : 'border-transparent text-gray-400 hover:bg-[#334155]/50 hover:text-gray-200'
                    }`}
                    >
                    <span className={`text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded-md ${isActive ? 'bg-yellow-500 text-black' : 'bg-[#0f172a] text-gray-500'}`}>
                        {idx + 1}
                    </span>
                    <div className="overflow-hidden">
                        <p className={`font-semibold truncate text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>{song.title}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                            {song.key} • {song.bpm} bpm
                        </p>
                    </div>
                    </button>
                  )
              })}
              {service.songs.length === 0 && (
                  <p className="text-gray-600 text-sm px-6 italic">Aguardando músicas...</p>
              )}
            </div>
          </div>

          <div className="p-6 mt-4 border-t border-[#334155]">
             <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Equipe</h3>
             <div className="flex flex-wrap gap-2">
                {service.team.map(musician => (
                    <div key={musician.id} className="inline-flex items-center gap-2 bg-[#334155] rounded-full pl-1 pr-3 py-1 border border-[#475569]">
                        <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                            {musician.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-300">{musician.name}</span>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Main Content (Chord Sheet) */}
      <div className="flex-1 overflow-y-auto bg-[#0f172a] custom-scrollbar relative">
        {currentSong ? (
          <div className="max-w-5xl mx-auto p-6 md:p-16 pb-40">
            <div className="mb-10 border-b border-[#334155] pb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">{currentSong.title}</h1>
                    <span className="text-xl text-blue-400 font-medium">{currentSong.artist}</span>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-8">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1">Tom Original</span>
                        <span className="px-4 py-2 rounded-lg bg-[#1e293b] border border-yellow-500/30 text-yellow-400 font-mono text-xl font-bold shadow-lg shadow-yellow-900/10">
                            {currentSong.key}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1">Andamento</span>
                        <span className="px-4 py-2 rounded-lg bg-[#1e293b] border border-[#334155] text-gray-300 font-mono text-xl">
                            {currentSong.bpm} <span className="text-sm text-gray-600">BPM</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="prose prose-invert max-w-none">
                <pre className="font-mono whitespace-pre-wrap text-lg md:text-2xl leading-[2.5] text-gray-200 overflow-x-auto pb-20 bg-transparent border-none p-0 selection:bg-yellow-500/30 selection:text-yellow-200">
                {currentSong.content.replace(/\[(.*?)\]/g, (match) => {
                    // Tentar destacar as cifras se vierem entre colchetes (depende do formato da IA, 
                    // mas geralmente a IA entrega texto puro com cifras em cima. 
                    // Se a IA entregar texto puro, o CSS abaixo lida com a fonte monoespaçada)
                    return match;
                })}
                {currentSong.content}
                </pre>
            </div>
          </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <div className="w-24 h-24 rounded-full bg-[#1e293b] flex items-center justify-center mb-6 animate-pulse">
                    <Music className="w-10 h-10 text-gray-500" />
                </div>
                <p className="text-xl font-medium text-gray-400">Selecione uma música no menu</p>
                <p className="text-sm text-gray-600 mt-2">O repertório aparecerá aqui</p>
            </div>
        )}
      </div>
    </div>
  );
};
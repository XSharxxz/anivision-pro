"use client"
import React from 'react';
import { Play, Star, Plus, Info, Clock, ShieldCheck } from 'lucide-react';

export default function SoloLeveling() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* HERO SECTION */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <img 
          src="https://images.alphacoders.com/134/1345380.png" 
          className="w-full h-full object-cover scale-105" 
          alt="Solo Leveling Banner"
        />
        
        <div className="absolute bottom-16 left-6 md:left-20 z-20 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter">POPÜLER</span>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aksiyon • Fantastik • Macera</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-none">SOLO LEVELING</h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 max-w-2xl font-medium">
            Dünyanın en zayıf avcısıyken, gizemli bir sistem sayesinde seviye atlayabilen tek kişiye dönüşen Jinwoo'nun hikayesi. Kaderini kendi ellerine alan bir adamın yükselişi.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-black px-12 py-5 rounded-3xl font-black italic uppercase flex items-center gap-3 hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-white/5">
              <Play fill="currentColor" size={24}/> HEMEN İZLE
            </button>
            <button className="bg-zinc-800/40 backdrop-blur-xl border border-white/10 text-white px-8 py-5 rounded-3xl font-black italic uppercase hover:bg-white/10 transition-all">
              <Plus size={24}/>
            </button>
          </div>
        </div>
      </div>

      {/* BÖLÜMLER */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-6">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">BÖLÜMLER <span className="text-red-600 text-sm ml-2">12 BÖLÜM</span></h2>
          <div className="flex items-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span className="flex items-center gap-2"><Star className="text-yellow-500" size={14}/> 9.8 PUAN</span>
            <span className="flex items-center gap-2"><Clock size={14}/> 2024</span>
          </div>
        </div>

        <div className="grid gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="group flex items-center gap-6 p-6 rounded-[2.5rem] bg-zinc-900/20 border border-white/5 hover:bg-red-600/5 hover:border-red-600/20 transition-all cursor-pointer">
              <div className="relative w-40 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                <img src={`https://img.youtube.com/vi/6f_S0fLpB9k/0.jpg`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Play fill="white" size={30} />
                </div>
              </div>
              <div className="flex-1">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">BÖLÜM 0{num}</span>
                <h3 className="text-lg font-black italic uppercase tracking-tight group-hover:text-red-600 transition-colors">Uyanışın Başlangıcı</h3>
                <p className="text-gray-500 text-xs mt-2 line-clamp-1">Zindanın derinliklerinde hayatta kalma mücadelesi veren Jinwoo, beklenmedik bir güçle karşılaşır.</p>
              </div>
              <div className="hidden md:flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-zinc-700 uppercase">24 DK</span>
                <ShieldCheck size={18} className="text-green-500/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
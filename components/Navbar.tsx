"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { Crown, UserCircle2, LogOut, Search, Bell, Calendar, MessageSquare, Home, Settings } from 'lucide-react';

export default function Navbar() {
  const [activeProfile, setActiveProfile] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const updateNavbar = async () => {
    const profile = localStorage.getItem('active_profile');
    if (profile) setActiveProfile(JSON.parse(profile));

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single();
      setIsPremium(data?.is_premium || false);
    }
  };

  useEffect(() => {
    updateNavbar();
    const interval = setInterval(updateNavbar, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('active_profile');
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 w-full z-[100] px-6 md:px-16 py-6 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5">
      
      {/* Sol Menü */}
      <div className="flex items-center gap-10">
        <Link href="/" className="text-3xl font-black italic text-red-600 tracking-tighter uppercase">ANIVISION</Link>
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase italic text-gray-400">
          <Link href="/" className="flex items-center gap-2 hover:text-white transition"><Home size={14} className="text-red-600" /> Ana Sayfa</Link>
          <Link href="/calendar" className="flex items-center gap-2 hover:text-white transition"><Calendar size={14} className="text-red-600" /> Takvim</Link>
          <Link href="/request" className="flex items-center gap-2 hover:text-white transition"><MessageSquare size={14} className="text-red-600" /> Anime Öneri</Link>
          <Link href="/pricing" className="text-red-600 flex items-center gap-1 hover:scale-105 transition-transform"><Crown size={14} /> Premium</Link>
        </div>
      </div>
      
      {/* Sağ Profil Alanı */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {activeProfile ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`flex items-center gap-3 bg-zinc-900/80 p-1 pr-4 rounded-full border transition-all duration-500
                  ${isPremium ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'border-white/10'}`}
              >
                <div className={`relative rounded-full p-0.5 ${isPremium ? 'bg-gradient-to-tr from-yellow-600 to-yellow-200' : ''}`}>
                  <img src={activeProfile.avatar_url} className="w-9 h-9 rounded-full object-cover" />
                </div>
                <span className={`text-[10px] font-black tracking-widest uppercase italic ${isPremium ? 'text-yellow-500' : 'text-white'}`}>
                  {activeProfile.name} {isPremium && "👑"}
                </span>
              </button>

              {/* AÇILIR MENÜ (GÖRÜNÜRLÜK DÜZELTİLDİ) */}
              {isOpen && (
                <div className="absolute right-0 top-14 w-60 bg-[#1a1a1a] border border-white/10 rounded-3xl p-3 shadow-2xl animate-in fade-in zoom-in duration-200 ring-1 ring-black">
                  <div className="px-4 py-3 mb-2 border-b border-white/5 text-center">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Durum</p>
                    <p className={`text-[10px] font-bold uppercase italic ${isPremium ? 'text-yellow-500' : 'text-red-600'}`}>
                      {isPremium ? 'PREMIUM ÜYE' : 'STANDART ÜYE'}
                    </p>
                  </div>
                  
                  {/* Profil Ayarları (Geri Geldi) */}
                  <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition text-[10px] font-black uppercase italic text-gray-200">
                    <Settings size={16} className="text-gray-400" /> Profil Ayarları
                  </Link>

                  <Link href="/profiles" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition text-[10px] font-black uppercase italic text-gray-200">
                    <UserCircle2 size={16} className="text-gray-400" /> Profil Değiştir
                  </Link>
                  
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-600/10 text-red-600 rounded-xl transition text-[10px] font-black uppercase italic border-t border-white/5 mt-2">
                    <LogOut size={16} /> Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="bg-red-600 px-6 py-2 rounded-full font-black text-[10px] uppercase italic text-white hover:bg-white hover:text-black transition-all">GİRİŞ YAP</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
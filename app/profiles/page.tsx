"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { Plus, Lock, X, Loader2, Trash2 } from 'lucide-react';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPinMode, setIsPinMode] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newPin, setNewPin] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [isPinError, setIsPinError] = useState(false);

  const router = useRouter();

  useEffect(() => { loadProfiles(); }, []);

  const loadProfiles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');
    const { data } = await supabase.from('sub_profiles').select('*').eq('main_user_id', user.id);
    setProfiles(data || []);
    setLoading(false);
  };

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('sub_profiles').insert([{
      main_user_id: user?.id,
      name: newName.toUpperCase(),
      pin_code: newPin || null,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newName}`
    }]);

    if (!error) {
      setIsModalOpen(false);
      setNewName('');
      setNewPin('');
      loadProfiles();
    }
    setActionLoading(false);
  };

  const handleDeleteProfile = async (id: string) => {
    if (!confirm("Bu profili silmek istediğine emin misin?")) return;
    const { error } = await supabase.from('sub_profiles').delete().eq('id', id);
    if (!error) {
      setProfiles(profiles.filter(p => p.id !== id));
      localStorage.removeItem('active_profile');
    }
  };

  const handleProfileClick = (profile: any) => {
    if (isEditMode) {
      handleDeleteProfile(profile.id);
    } else {
      if (profile.pin_code) {
        setSelectedProfile(profile);
        setIsPinMode(true);
      } else {
        completeLogin(profile);
      }
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === selectedProfile.pin_code) {
      completeLogin(selectedProfile);
    } else {
      const audio = new Audio('/sounds/error.mp3');
      audio.play().catch(() => {});
      setIsPinError(true);
      setTimeout(() => setIsPinError(false), 500);
      setEnteredPin('');
    }
  };

  const completeLogin = (profile: any) => {
    localStorage.setItem('active_profile', JSON.stringify(profile));
    router.push('/');
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-red-600 font-black italic">YÜKLENİYOR...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
      
      {!isPinMode ? (
        <>
          <h1 className="text-4xl md:text-5xl font-black italic mb-12 uppercase tracking-tighter text-center">
            {isEditMode ? "PROFİLLERİ YÖNET" : "KİM İZLİYOR?"}
          </h1>
          
          <div className="flex flex-wrap justify-center gap-8 max-w-5xl">
            {profiles.map((profile) => (
              <div key={profile.id} className="group flex flex-col items-center gap-4 relative">
                <button 
                  onClick={() => handleProfileClick(profile)}
                  className={`relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 transition-all duration-300 transform shadow-2xl bg-zinc-900
                    ${isEditMode ? 'border-red-600 scale-95 opacity-50' : 'border-transparent group-hover:border-red-600 group-hover:scale-105'}`}
                >
                  <img src={profile.avatar_url} className="w-full h-full object-cover" />
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Trash2 size={40} className="text-white animate-pulse" />
                    </div>
                  )}
                  {!isEditMode && profile.pin_code && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Lock size={24} className="text-white/50" />
                    </div>
                  )}
                </button>
                <span className="text-gray-500 font-black uppercase text-xs tracking-widest italic">{profile.name}</span>
              </div>
            ))}

            {/* Profil Ekleme Butonu (Düzenleme modunda gizli kalır) */}
            {profiles.length < 5 && !isEditMode && (
              <button onClick={() => setIsModalOpen(true)} className="flex flex-col items-center gap-4 group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-dashed border-zinc-800 flex items-center justify-center group-hover:border-white transition-all">
                  <Plus size={40} className="text-zinc-700 group-hover:text-white" />
                </div>
                <span className="text-zinc-700 font-black uppercase text-xs tracking-widest italic uppercase">EKLE</span>
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`mt-20 px-10 py-3 rounded-xl font-black uppercase italic tracking-widest border-2 transition-all
              ${isEditMode ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-500 hover:border-white hover:text-white'}`}
          >
            {isEditMode ? "BİTTİ" : "PROFİLLERİ YÖNET"}
          </button>
        </>
      ) : (
        /* PIN EKRANI */
        <div className={`flex flex-col items-center transition-all ${isPinError ? 'animate-shake' : ''}`}>
          <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-red-600 shadow-2xl shadow-red-600/20">
            <img src={selectedProfile.avatar_url} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-black italic uppercase mb-2 tracking-tighter">{selectedProfile.name}</h2>
          <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-center ${isPinError ? 'text-red-600' : 'text-gray-500'}`}>PROFİL KİLİTLİ. PIN GİRİN.</p>
          <form onSubmit={handlePinSubmit} className="flex flex-col items-center gap-6">
            <input autoFocus type="password" maxLength={4} value={enteredPin} onChange={(e) => setEnteredPin(e.target.value)} placeholder="****" className={`bg-zinc-900 border-2 w-48 p-4 rounded-2xl text-center text-4xl font-black tracking-[0.5em] outline-none transition-all ${isPinError ? 'border-red-600 text-red-600' : 'border-white/5 focus:border-red-600'}`} />
            <button type="button" onClick={() => setIsPinMode(false)} className="text-[10px] font-black uppercase text-gray-500">GERİ DÖN</button>
          </form>
        </div>
      )}

      {/* PROFİL EKLEME MODAL (DÜZELTİLDİ) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[300] flex items-center justify-center p-6">
          <div className="bg-[#111] border border-white/10 w-full max-w-md rounded-[3rem] p-10 relative animate-in slide-in-from-bottom duration-500">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X /></button>
            <h2 className="text-3xl font-black italic uppercase mb-8 tracking-tighter">Profil Ekle</h2>
            <form onSubmit={handleAddProfile} className="space-y-6">
              <input required value={newName} onChange={(e) => setNewName(e.target.value)} type="text" placeholder="PROFİL ADI" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-red-600 font-bold uppercase" />
              <input maxLength={4} value={newPin} onChange={(e) => setNewPin(e.target.value)} type="password" placeholder="PIN (İSTEĞE BAĞLI)" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-red-600 font-bold text-center tracking-widest" />
              <button disabled={actionLoading} className="w-full bg-red-600 py-5 rounded-2xl font-black italic uppercase hover:bg-white hover:text-black transition-all shadow-xl shadow-red-600/20">
                {actionLoading ? "..." : "OLUŞTUR"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; animation-iteration-count: 2; }
      `}</style>
    </div>
  );
}
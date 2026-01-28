"use client"
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Giriş Hatası: " + error.message);
      setLoading(false);
    } else {
      // ÖNEMLİ: Girişten sonra profil seçimine yönlendir
      router.push('/profiles');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic text-red-600 tracking-tighter uppercase mb-2">GİRİŞ YAP</h1>
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase leading-tight">Anime dünyasına geri dön</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-600" size={20} />
            <input required type="email" placeholder="E-POSTA" className="w-full bg-black border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-red-600 transition font-bold text-xs"
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-600" size={20} />
            <input required type="password" placeholder="ŞİFRE" className="w-full bg-black border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-red-600 transition font-bold text-xs"
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button disabled={loading} className="w-full bg-red-600 hover:bg-white hover:text-black py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 italic uppercase">
            {loading ? <Loader2 className="animate-spin" /> : "GİRİŞ YAP"}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-500 text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2">
          Hesabın yok mu? <a href="/register" className="text-white hover:text-red-600 transition flex items-center gap-1">KAYDOL <ArrowRight size={12} /></a>
        </div>
      </div>
    </div>
  );
}
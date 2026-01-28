"use client"
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldCheck, Loader2 } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { alert(error.message); setLoading(false); }
    else { setStep(2); setLoading(false); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'signup' });
    if (error) { alert("Hatalı Kod!"); setLoading(false); }
    else { router.push('/profiles'); } // Kayıt sonrası profil seçimine
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900/50 p-10 rounded-[3rem] border border-white/10 shadow-2xl">
        {step === 1 ? (
          <form onSubmit={handleSignUp} className="space-y-4 text-center">
            <h1 className="text-4xl font-black italic text-red-600 uppercase mb-8">KAYDOL</h1>
            <input required type="email" placeholder="E-POSTA" className="w-full bg-black border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 font-bold text-xs" onChange={(e) => setEmail(e.target.value)} />
            <input required type="password" placeholder="ŞİFRE" className="w-full bg-black border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 font-bold text-xs" onChange={(e) => setPassword(e.target.value)} />
            <button disabled={loading} className="w-full bg-red-600 py-4 rounded-2xl font-black italic uppercase transition-all">
              {loading ? "..." : "KOD GÖNDER"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6 text-center">
            <ShieldCheck className="mx-auto text-red-600 mb-4" size={50} />
            <h1 className="text-2xl font-black italic uppercase">KODU GİR</h1>
            <input required type="text" maxLength={6} placeholder="000000" className="w-full bg-black border-2 border-red-600/30 p-5 rounded-3xl text-center text-4xl font-black tracking-[0.4em] outline-none" onChange={(e) => setOtp(e.target.value)} />
            <button disabled={loading} className="w-full bg-white text-black py-4 rounded-2xl font-black italic uppercase">
              {loading ? "..." : "ONAYLA"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
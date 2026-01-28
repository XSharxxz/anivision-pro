"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Save, ShieldCheck, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // PIN & Email States
  const [newPin, setNewPin] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');
      setUser(user);
      setNewEmail(user.email || '');
      setLoading(false);
    };
    getUser();
  }, [router]);

  // PIN GÜNCELLEME
  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const activeProfile = JSON.parse(localStorage.getItem('active_profile') || '{}');
    
    const { error } = await supabase.from('sub_profiles').update({ pin_code: newPin }).eq('id', activeProfile.id);

    if (error) setMessage({ type: 'error', text: 'Hata: ' + error.message });
    else {
      setMessage({ type: 'success', text: 'PIN başarıyla güncellendi!' });
      activeProfile.pin_code = newPin;
      localStorage.setItem('active_profile', JSON.stringify(activeProfile));
      setNewPin('');
    }
    setActionLoading(false);
  };

  // E-POSTA DEĞİŞİKLİK İSTEĞİ (KOD GÖNDERİR)
  const handleEmailRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setIsOtpStep(true);
      setMessage({ type: 'success', text: 'Yeni e-posta adresinize 6 haneli kod gönderildi.' });
    }
    setActionLoading(false);
  };

  // GELEN KODU ONAYLAMA
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    
    // Supabase e-posta değişikliği doğrulaması
    const { error } = await supabase.auth.verifyOtp({
      email: newEmail,
      token: otpCode,
      type: 'email_change'
    });

    if (error) {
      setMessage({ type: 'error', text: 'Hatalı kod: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'E-posta adresiniz başarıyla güncellendi!' });
      setIsOtpStep(false);
      setOtpCode('');
      // Kullanıcı bilgisini tazele
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    setActionLoading(false);
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-red-600 font-black italic">YÜKLENİYOR...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 flex justify-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-black italic uppercase mb-10 tracking-tighter border-l-4 border-red-600 pl-6">Hesap Ayarları</h1>

        {message.text && (
          <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 font-bold text-xs uppercase italic animate-in fade-in slide-in-from-top ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
            {message.text}
          </div>
        )}

        <div className="grid gap-8">
          {/* PIN BÖLÜMÜ */}
          <section className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-red-600" size={20} />
              <h2 className="text-lg font-black italic uppercase italic">PIN Değiştir</h2>
            </div>
            <form onSubmit={handleUpdatePin} className="flex gap-4">
              <input required maxLength={4} type="password" placeholder="YENİ PIN" value={newPin} onChange={(e)=>setNewPin(e.target.value)} className="flex-1 bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-red-600 font-bold text-center tracking-widest" />
              <button disabled={actionLoading} className="bg-white text-black px-8 rounded-2xl font-black uppercase italic hover:bg-red-600 hover:text-white transition-all text-xs">
                {actionLoading ? "..." : "KAYDET"}
              </button>
            </form>
          </section>

          {/* E-POSTA BÖLÜMÜ */}
          <section className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="text-red-600" size={20} />
              <h2 className="text-lg font-black italic uppercase italic">E-Posta Güncelle</h2>
            </div>

            {!isOtpStep ? (
              <form onSubmit={handleEmailRequest} className="space-y-4">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mevcut: {user?.email}</p>
                <div className="flex gap-4">
                  <input required type="email" placeholder="YENİ E-POSTA" value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} className="flex-1 bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-red-600 font-bold text-xs uppercase" />
                  <button disabled={actionLoading} className="bg-red-600 px-8 rounded-2xl font-black uppercase italic hover:bg-white hover:text-black transition-all text-xs">
                    {actionLoading ? "..." : "KOD GÖNDER"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyEmail} className="space-y-6 animate-in zoom-in duration-300">
                <div className="text-center">
                  <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest mb-4 italic">LÜTFEN YENİ E-POSTANIZA GELEN 6 HANELİ KODU GİRİN</p>
                  <input required maxLength={6} type="text" placeholder="000000" value={otpCode} onChange={(e)=>setOtpCode(e.target.value)} className="w-full bg-black border-2 border-red-600 p-4 rounded-2xl outline-none font-black text-center text-3xl tracking-[0.5em]" />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={()=>setIsOtpStep(false)} className="flex-1 text-[10px] font-black uppercase text-gray-500">İPTAL</button>
                  <button type="submit" className="flex-[2] bg-white text-black py-4 rounded-2xl font-black uppercase italic hover:bg-red-600 hover:text-white transition-all">
                    KODU ONAYLA
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
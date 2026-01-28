"use client"
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { Check, Star, Crown, Zap, Infinity } from 'lucide-react';

const plans = [
  { name: "Deneme Paketi", price: "1", duration: "3 GÜN", days: 3, features: ["En Yüksek - 4K Ultra HD", "4 Profil Seçeneği", "Reklamsız ve Kesintisiz Anime", "Çoklu Dublaj ve Alt Yazı", "Aynı Anda 4 Cihaz Desteği"] },
  { name: "Lite", price: "24.99", duration: "30 GÜN", days: 30, features: ["Geliştirilmiş - 1080p HDR", "2 Profil Seçeneği", "Reklamsız Anime", "10 Favori Anime Seçme", "Discord Premium Rolü", "2 Cihaz Desteği", "Pakete Özel Profil Çerçevesi"] },
  { name: "Standart", price: "89.99", duration: "30 GÜN", days: 30, features: ["En Yüksek - 4K Ultra HD", "4 Profil Seçeneği", "Reklamsız Video", "15 Favori Anime Seçme", "Günde 2 Anime İstek Oy", "Discord Premium Rolü", "4 Cihaz Desteği", "Pakete Özel Profil Çerçevesi"] },
  { name: "3+2 Ay", price: "449.99", duration: "150 GÜN", days: 150, features: ["En Yüksek - 4K Ultra HD", "4 Profil Seçeneği", "Reklamsız Video", "15 Favori Anime Seçme", "Günde 2 Anime İstek Oy", "Discord Premium Rolü", "4 Cihaz Desteği", "Pakete Özel Profil Çerçevesi"] },
  { name: "10+2 Ay", price: "1079.99", duration: "365 GÜN", days: 365, features: ["En Yüksek - 4K Ultra HD", "4 Profil Seçeneği", "Reklamsız Video", "15 Favori Anime Seçme", "Günde 2 Anime İstek Oy", "Discord Premium Rolü", "4 Cihaz Desteği", "Pakete Özel Profil Çerçevesi"] },
];

const infinitePlan = {
  name: "Sonsuz", price: "2.999.99", duration: "ÖMÜR BOYU", days: 99999, features: ["En Yüksek - 4K Ultra HD", "5 Profil Seçeneği", "Reklamsız Video", "Çoklu Dublaj ve Alt Yazı", "20 Favori Anime Seçme", "Günde 3 Anime İstek Oy", "Discord 'Sonsuz Üye' Rolü", "8 Cihaz Desteği", "Sonsuz Üye Rozeti", "Profile Özel Hareketli Avatar"]
};

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (plan: any) => {
    setLoading(plan.name);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Giriş yoksa kayıt sayfasına yönlendir
      router.push('/register');
      return;
    }

    // Giriş varsa direkt satın alma (upsert) işlemini yap
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + plan.days);

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      is_premium: true,
      plan_type: plan.name,
      premium_until: plan.days > 30000 ? null : expireDate.toISOString()
    });

    if (!error) {
      alert(`${plan.name} aktif edildi! İyi seyirler.`);
      router.push('/');
    } else {
      alert("Hata: " + error.message);
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter italic">Abonelik Planları</h1>
          <div className="w-20 h-1 bg-red-600 mt-4" />
        </div>

        {/* 5'li Grid Yapısı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-6 flex flex-col justify-between hover:border-red-600/50 transition-all duration-300 group">
              <div className="text-center">
                <h3 className="text-md font-black uppercase italic mb-4 text-gray-200">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-black italic">₺{plan.price}</span>
                </div>
                <div className="bg-red-600 text-[10px] font-black py-1 px-4 rounded-full inline-block mb-8 uppercase italic">{plan.duration}</div>
                
                <div className="space-y-4 text-left h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {plan.features.map(feat => (
                    <div key={feat} className="flex items-start gap-2 text-[10px] font-bold text-gray-500 uppercase leading-tight">
                      <Check size={12} className="text-red-600 shrink-0 mt-0.5" /> {feat}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleAction(plan)}
                className="w-full bg-red-600 group-hover:bg-white group-hover:text-black py-4 rounded-2xl font-black text-xs transition-all uppercase italic mt-8 shadow-lg shadow-red-600/10"
              >
                {loading === plan.name ? "..." : "DEVAM ET"}
              </button>
            </div>
          ))}
        </div>

        {/* Alttaki Özel Sonsuz Kartı */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#080808] border-2 border-red-600/20 rounded-[3rem] p-10 overflow-hidden hover:border-red-600 transition-all duration-500 group">
            <div className="absolute top-6 right-8 bg-red-600 text-[10px] font-black px-4 py-1 rounded-md italic uppercase animate-pulse">SINIRLI</div>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-3xl font-black uppercase italic mb-2">Sonsuz</h3>
                <p className="text-5xl font-black italic text-white mb-6">₺2.999.99</p>
                <div className="bg-white/10 text-white text-[10px] font-black py-2 px-6 rounded-xl inline-block uppercase italic mb-8">ÖMÜR BOYU</div>
                <button onClick={() => handleAction(infinitePlan)} className="hidden md:block w-full bg-red-600 group-hover:bg-white group-hover:text-black py-5 rounded-2xl font-black text-lg transition-all uppercase italic shadow-xl">
                  {loading === "Sonsuz" ? "..." : "DEVAM ET"}
                </button>
              </div>
              <div className="space-y-3">
                {infinitePlan.features.map(f => (
                  <div key={f} className="flex items-center gap-3 text-[11px] font-bold text-gray-300 uppercase">
                    <Check size={14} className="text-red-600 shrink-0" /> {f}
                  </div>
                ))}
                <button onClick={() => handleAction(infinitePlan)} className="md:hidden w-full bg-red-600 mt-8 py-5 rounded-2xl font-black text-lg transition-all uppercase italic">
                   DEVAM ET
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #dc2626; }
      `}</style>
    </div>
  );
}
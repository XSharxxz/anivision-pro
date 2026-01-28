"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Watch() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // 1. Kullanıcı oturumunu kontrol et
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // HESAP AÇIK DEĞİLSE -> REGISTER'A AT
        router.replace('/register');
        return;
      }

      // 2. Üyelik kontrolü (DB'den taze veri)
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile || !profile.is_premium) {
        // ÜYELİK YOKSA -> PRICING'E AT
        router.replace('/pricing');
      } else {
        // HER ŞEY TAMAMSA -> YÜKLEMEYİ BİTİR
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white italic">YÜKLENİYOR...</div>;

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="w-[80%] aspect-video bg-zinc-900 rounded-[3rem] border-4 border-white/5 flex items-center justify-center">
        <h2 className="text-3xl font-black italic uppercase">Video Oynatıcı Aktif</h2>
      </div>
    </div>
  );
}
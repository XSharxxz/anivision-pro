"use client"
import React from 'react';
import Link from 'next/link';
import { Play, Info, Plus } from 'lucide-react';

export default function Home() {
  // Örnek Anime Listesi (Gerçek projede bunları veritabanından çekeceğiz)
  const animeList = [
    { id: 1, title: "Solo Leveling", image: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000", tags: ["Aksiyon", "Fantastik"] },
    { id: 2, title: "Jujutsu Kaisen", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000", tags: ["Doğaüstü", "Dövüş"] },
    { id: 3, title: "Demon Slayer", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000", tags: ["Macera", "Tarihi"] },
    { id: 4, title: "Attack on Titan", image: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=800", tags: ["Dram", "Gerilim"] },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      
      {/* Öne Çıkan Anime (Hero Section) */}
      <div className="relative h-[85vh] w-full">
        <img 
          src={animeList[0].image} 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Featured Anime"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-20 max-w-4xl">
          <h2 className="text-red-600 font-black tracking-[0.4em] uppercase text-sm mb-4 italic">Sezonun Favorisi</h2>
          <h1 className="text-8xl font-black italic tracking-tighter leading-[0.8] mb-6 uppercase">
            SOLO<br/>LEVELING
          </h1>
          <p className="text-gray-300 text-lg font-medium mb-8 max-w-lg">
            Dünyanın en zayıf avcısıyken, gizemli bir sistem sayesinde seviye atlayabilen tek kişiye dönüşen Jinwoo'nun hikayesi başlıyor.
          </p>
          
          <div className="flex gap-4">
            {/* Bu Buton Yönlendirme Zincirini Başlatır */}
            <Link href="/watch" className="bg-white text-black px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 uppercase italic">
              <Play fill="currentColor" size={20} /> Hemen İzle
            </Link>
            <button className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-white/20 transition-all uppercase italic">
              <Info size={20} /> Detaylar
            </button>
          </div>
        </div>
      </div>

      {/* Anime Listesi (Grid) */}
      <div className="px-10 md:px-20 -mt-20 relative z-20 pb-20">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-3">
          <div className="w-2 h-8 bg-red-600 rounded-full" /> Popüler Seriler
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {animeList.map((anime) => (
            <Link href="/watch" key={anime.id} className="group relative aspect-[16/10] rounded-[2rem] overflow-hidden border-2 border-white/5 cursor-pointer">
              <img 
                src={anime.image} 
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:rotate-1"
                alt={anime.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex gap-2 mb-2">
                  {anime.tags.map(tag => (
                    <span key={tag} className="text-[8px] font-black bg-red-600/80 px-2 py-0.5 rounded-full uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
                <h4 className="text-xl font-black italic uppercase tracking-tighter transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                  {anime.title}
                </h4>
                <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition duration-300 mt-2">
                  <Play size={10} fill="currentColor" /> İZLEMEK İÇİN TIKLA
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
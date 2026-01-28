import Link from 'next/link';
import { PartyPopper, ChevronRight } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
      <div className="max-w-md animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(234,179,8,0.5)]">
          <PartyPopper size={48} className="text-black" />
        </div>
        <h1 className="text-4xl font-black italic text-white uppercase mb-4 tracking-tighter">TEBRİKLER!</h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-10 leading-relaxed">
          ARTIK ANIVISION PREMIUM ÜYESİSİN. TÜM İÇERİKLER VE ÖZEL PROFiL PARILTI OTOMATiK OLARAK AKTİF EDİLDİ.
        </p>
        <Link href="/" className="bg-red-600 hover:bg-white hover:text-black text-white px-10 py-4 rounded-2xl font-black italic uppercase transition-all flex items-center justify-center gap-2 group">
          KEŞFETMEYE BAŞLA <ChevronRight className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
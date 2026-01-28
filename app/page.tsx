import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4 text-red-600">ANIVISION</h1>
      <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12 max-w-md">
        SINIRSIZ ANIME DENEYIMI VE PREMIUM ÖZELLIKLERLE GELECEĞIN YAYINCILIK PLATFORMU.
      </p>
      <Link href="/profiles" className="bg-white text-black px-12 py-5 rounded-2xl font-black italic uppercase hover:bg-red-600 hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">
        IZLEMEYE BAŞLA
      </Link>
    </div>
  );
}
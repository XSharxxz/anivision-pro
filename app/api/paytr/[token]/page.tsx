export default function PayTRPage({ params }: { params: { token: string } }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-24">
      <h1 className="text-white font-black italic uppercase mb-8">Güvenli Ödeme Sayfası</h1>
      <iframe 
        src={`https://www.paytr.com/odeme/guvenli/${params.token}`} 
        id="paytriframe" 
        className="w-full max-w-4xl h-[700px] border-0 rounded-3xl bg-white"
      />
    </div>
  );
}
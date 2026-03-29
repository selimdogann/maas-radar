import { prisma } from "@/lib/db";
import MulakatForm from "./MulakatForm";
import Link from "next/link";

function zamanFarki(tarih: Date) {
  const fark = Date.now() - new Date(tarih).getTime();
  const gun = Math.floor(fark / 86400000);
  if (gun > 30) return `${Math.floor(gun / 30)} ay önce`;
  if (gun > 0) return `${gun} gün önce`;
  return "Bugün";
}

const ZORLUK_RENK: Record<string, string> = {
  Kolay: "bg-green-50 text-green-700",
  Orta: "bg-yellow-50 text-yellow-700",
  Zor: "bg-red-50 text-red-700",
};

const SONUC_RENK: Record<string, string> = {
  "Teklif Aldım": "bg-emerald-50 text-emerald-700",
  "Reddedildim": "bg-red-50 text-red-700",
  "Beklemede": "bg-slate-100 text-slate-600",
};

export default async function MulakatPage({
  searchParams,
}: {
  searchParams: Promise<{ sirket?: string }>;
}) {
  const { sirket } = await searchParams;

  const mulakatlar = await prisma.interview.findMany({
    where: { sirket: sirket ? { contains: sirket } : undefined },
    orderBy: { olusturuldu: "desc" },
    take: 50,
  });

  const sirketler = await prisma.interview.groupBy({
    by: ["sirket"],
    _count: { sirket: true },
    orderBy: { _count: { sirket: "desc" } },
    take: 10,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Mülakat Deneyimleri</h1>
        <p className="text-slate-500 text-sm">Gerçek mülakat sorularını ve süreçlerini keşfet.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol — form + filtre */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="font-semibold text-slate-800 text-sm mb-4">Deneyim Ekle</h2>
            <MulakatForm />
          </div>

          {sirketler.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wide mb-3">En Çok Deneyim</h3>
              <div className="space-y-2">
                {sirketler.map((s) => (
                  <Link
                    key={s.sirket}
                    href={`/mulakat?sirket=${encodeURIComponent(s.sirket)}`}
                    className="flex justify-between items-center text-sm hover:text-blue-600 transition-colors"
                  >
                    <span className="text-slate-700">{s.sirket}</span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{s._count.sirket}</span>
                  </Link>
                ))}
              </div>
              {sirket && (
                <Link href="/mulakat" className="block mt-3 text-xs text-blue-600 hover:underline">
                  Tümünü göster
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Sağ — liste */}
        <div className="lg:col-span-2 space-y-3">
          {mulakatlar.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="text-4xl mb-3">🎤</div>
              <h3 className="font-semibold text-slate-700 mb-1">Henüz deneyim yok</h3>
              <p className="text-slate-400 text-sm">İlk mülakat deneyimini paylaş!</p>
            </div>
          ) : (
            mulakatlar.map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex justify-between items-start mb-2 gap-3 flex-wrap">
                  <div>
                    <span className="font-bold text-slate-900">{m.sirket}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="text-slate-600 text-sm">{m.pozisyon}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ZORLUK_RENK[m.zorluk] ?? "bg-slate-100 text-slate-600"}`}>
                      {m.zorluk}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SONUC_RENK[m.sonuc] ?? "bg-slate-100 text-slate-600"}`}>
                      {m.sonuc}
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-2 leading-relaxed">{m.surec}</p>
                {m.sorular && (
                  <div className="bg-slate-50 rounded-lg p-3 mb-2">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Sorulan Sorular:</p>
                    <p className="text-slate-700 text-sm">{m.sorular}</p>
                  </div>
                )}
                <div className="flex gap-4 text-xs text-slate-400 mt-2">
                  <span>{m.olumlu ? "👍 Tavsiye eder" : "👎 Tavsiye etmez"}</span>
                  <span>🕐 {zamanFarki(m.olusturuldu)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

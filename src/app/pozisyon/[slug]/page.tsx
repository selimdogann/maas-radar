import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatMaas, hesaplaPercentileGrubu } from "@/lib/stats";
import Link from "next/link";

export const dynamic = "force-dynamic";

function maskSirket(s: string) {
  return s.slice(0, 3) + "***";
}

export default async function PozisyonDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pozisyon = decodeURIComponent(slug);

  const maaslar = await prisma.salary.findMany({
    where: { pozisyon: { contains: pozisyon } },
    orderBy: { olusturuldu: "desc" },
  });

  if (maaslar.length === 0) notFound();

  const istatistik = hesaplaPercentileGrubu(maaslar.map((m) => m.maasAylik));

  const sektorDagilim = maaslar.reduce<Record<string, number>>((acc, m) => {
    acc[m.sektor] = (acc[m.sektor] || 0) + 1;
    return acc;
  }, {});

  const sehirDagilim = maaslar.reduce<Record<string, number[]>>((acc, m) => {
    if (!acc[m.sehir]) acc[m.sehir] = [];
    acc[m.sehir].push(m.maasAylik);
    return acc;
  }, {});

  const deneyimGruplari = [
    { label: "0–2 yıl", min: 0, max: 2 },
    { label: "3–5 yıl", min: 3, max: 5 },
    { label: "6–10 yıl", min: 6, max: 10 },
    { label: "10+ yıl", min: 11, max: 99 },
  ].map((g) => {
    const grup = maaslar.filter((m) => m.deneyimYil >= g.min && m.deneyimYil <= g.max);
    const ort = grup.length > 0 ? Math.round(grup.reduce((a, b) => a + b.maasAylik, 0) / grup.length) : 0;
    return { ...g, ortalama: ort, adet: grup.length };
  });

  const benzerPozisyonlar = await prisma.salary.groupBy({
    by: ["pozisyon"],
    _count: { pozisyon: true },
    _avg: { maasAylik: true },
    where: { sektor: { in: [...new Set(maaslar.map((m) => m.sektor))] }, NOT: { pozisyon: { contains: pozisyon } } },
    orderBy: { _count: { pozisyon: "desc" } },
    take: 6,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/maaslar" className="text-sm text-blue-600 hover:underline mb-4 block">
        ← Tüm maaşlar
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{pozisyon}</h1>
        <p className="text-slate-500 text-sm">{maaslar.length} anonim veri noktası</p>
      </div>

      {/* Percentile kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: "P25", value: istatistik.p25, color: "text-slate-600" },
          { label: "Medyan", value: istatistik.p50, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "P75", value: istatistik.p75, color: "text-emerald-700" },
          { label: "P90", value: istatistik.p90, color: "text-purple-700" },
          { label: "Ortalama", value: istatistik.ortalama, color: "text-slate-700" },
        ].map((item) => (
          <div key={item.label} className={`${item.bg ?? "bg-white"} rounded-xl border border-slate-200 p-4 text-center shadow-sm`}>
            <div className={`text-lg font-bold ${item.color}`}>{formatMaas(item.value)}</div>
            <div className="text-xs text-slate-400 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Deneyim bazlı */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">Deneyime Göre Maaş</h2>
          <div className="space-y-3">
            {deneyimGruplari.map((g) => (
              <div key={g.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{g.label}</span>
                  <span className="font-semibold text-slate-900">
                    {g.adet > 0 ? formatMaas(g.ortalama) : "—"}
                    <span className="text-slate-400 font-normal text-xs ml-1">({g.adet})</span>
                  </span>
                </div>
                {g.adet > 0 && (
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(g.ortalama / istatistik.p90) * 100}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Şehir bazlı */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">Şehre Göre Ortalama</h2>
          <div className="space-y-2.5">
            {Object.entries(sehirDagilim)
              .map(([sehir, maasListesi]) => ({ sehir, ort: Math.round(maasListesi.reduce((a, b) => a + b, 0) / maasListesi.length), adet: maasListesi.length }))
              .sort((a, b) => b.ort - a.ort)
              .slice(0, 6)
              .map((item) => (
                <div key={item.sehir} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">{item.sehir}</span>
                  <span className="font-semibold text-slate-900">{formatMaas(item.ort)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Sektör dağılımı */}
      {Object.keys(sektorDagilim).length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6">
          <h2 className="font-bold text-slate-900 mb-4">Sektör Dağılımı</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(sektorDagilim).sort((a, b) => b[1] - a[1]).map(([sektor, adet]) => (
              <span key={sektor} className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1 text-sm text-slate-700">
                {sektor.split(" & ")[0]} <span className="text-slate-400">({adet})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Son maaşlar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6">
        <h2 className="font-bold text-slate-900 mb-4">Son Eklenen Veriler</h2>
        <div className="space-y-2">
          {maaslar.slice(0, 10).map((m) => (
            <div key={m.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-500">{maskSirket(m.sirket)}</span>
                <span className="text-xs text-slate-400">{m.sehir} · {m.deneyimYil} yıl</span>
              </div>
              <span className="font-bold text-slate-900">{formatMaas(m.maasAylik)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benzer pozisyonlar */}
      {benzerPozisyonlar.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">Benzer Pozisyonlar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {benzerPozisyonlar.map((p) => (
              <Link
                key={p.pozisyon}
                href={`/pozisyon/${encodeURIComponent(p.pozisyon)}`}
                className="bg-slate-50 rounded-xl p-3 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 transition-all"
              >
                <p className="text-sm font-medium text-slate-800 truncate">{p.pozisyon}</p>
                <p className="text-xs text-blue-600 font-bold mt-1">{formatMaas(Math.round(p._avg.maasAylik ?? 0))}</p>
                <p className="text-xs text-slate-400">{p._count.pozisyon} veri</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

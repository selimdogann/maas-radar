import { prisma } from "@/lib/db";
import { formatMaas, hesaplaPercentileGrubu } from "@/lib/stats";
import Link from "next/link";

export const dynamic = "force-dynamic";

function ort(nums: number[]) {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export default async function MaasAnaliziPage() {
  const [tumMaaslar, sektorIstatistik, sehirIstatistik, egitimIstatistik, calismaSekliIstatistik] = await Promise.all([
    prisma.salary.findMany({ select: { maasAylik: true, sektor: true, sehir: true, deneyimYil: true, cinsiyet: true, egitimSeviyesi: true, calismaSekli: true } }),
    prisma.salary.groupBy({ by: ["sektor"], _avg: { maasAylik: true }, _count: { sektor: true }, orderBy: { _avg: { maasAylik: "desc" } } }),
    prisma.salary.groupBy({ by: ["sehir"], _avg: { maasAylik: true }, _count: { sehir: true }, orderBy: { _avg: { maasAylik: "desc" } }, take: 10 }),
    prisma.salary.groupBy({ by: ["egitimSeviyesi"], _avg: { maasAylik: true }, _count: { egitimSeviyesi: true }, orderBy: { _avg: { maasAylik: "desc" } } }),
    prisma.salary.groupBy({ by: ["calismaSekli"], _avg: { maasAylik: true }, _count: { calismaSekli: true }, orderBy: { _avg: { maasAylik: "desc" } } }),
  ]);

  const toplamVeri = tumMaaslar.length;
  const istatistik = hesaplaPercentileGrubu(tumMaaslar.map((m) => m.maasAylik));

  // Cinsiyet analizi
  const kadin = tumMaaslar.filter((m) => m.cinsiyet === "Kadın").map((m) => m.maasAylik);
  const erkek = tumMaaslar.filter((m) => m.cinsiyet === "Erkek").map((m) => m.maasAylik);
  const cinsiyetBelirtmemis = tumMaaslar.filter((m) => !m.cinsiyet).length;
  const kadinOrt = ort(kadin);
  const erkekOrt = ort(erkek);
  const ucurumYuzde = erkekOrt > 0 && kadinOrt > 0 ? Math.round(((erkekOrt - kadinOrt) / erkekOrt) * 100) : null;

  // Deneyim korelasyonu
  const deneyimGruplari = [
    { label: "0–2", min: 0, max: 2 },
    { label: "3–5", min: 3, max: 5 },
    { label: "6–10", min: 6, max: 10 },
    { label: "11–15", min: 11, max: 15 },
    { label: "15+", min: 16, max: 99 },
  ].map((g) => ({
    ...g,
    ortalama: ort(tumMaaslar.filter((m) => m.deneyimYil >= g.min && m.deneyimYil <= g.max).map((m) => m.maasAylik)),
    adet: tumMaaslar.filter((m) => m.deneyimYil >= g.min && m.deneyimYil <= g.max).length,
  }));

  const maxSehir = Math.max(...sehirIstatistik.map((s) => s._avg.maasAylik ?? 0));
  const maxSektor = Math.max(...sektorIstatistik.map((s) => s._avg.maasAylik ?? 0));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Maaş Analizi</h1>
        <p className="text-slate-500 text-sm">{toplamVeri} anonim veri üzerinden derinlemesine maaş analizi.</p>
      </div>

      {toplamVeri === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-4xl mb-3">📊</p>
          <p className="font-semibold text-slate-700">Henüz yeterli veri yok</p>
          <Link href="/maas-ekle" className="mt-3 inline-block text-sm text-blue-600 hover:underline">Maaş ekle →</Link>
        </div>
      )}

      {toplamVeri > 0 && (
        <>
          {/* Genel dağılım */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Medyan", value: istatistik.p50, color: "text-blue-700", bg: "bg-blue-50" },
              { label: "Ortalama", value: istatistik.ortalama, color: "text-slate-900", bg: "bg-white" },
              { label: "P75", value: istatistik.p75, color: "text-emerald-700", bg: "bg-emerald-50" },
              { label: "P90", value: istatistik.p90, color: "text-purple-700", bg: "bg-purple-50" },
            ].map((item) => (
              <div key={item.label} className={`${item.bg} border border-slate-200 rounded-xl p-4 text-center shadow-sm`}>
                <p className={`text-lg font-bold ${item.color}`}>{formatMaas(item.value)}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Cinsiyet maaş uçurumu */}
          {(kadin.length > 0 || erkek.length > 0) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
              <h2 className="font-bold text-slate-900 mb-1">Cinsiyet Maaş Analizi</h2>
              <p className="text-slate-500 text-sm mb-5">
                {cinsiyetBelirtmemis > 0 && `${cinsiyetBelirtmemis} kişi cinsiyet belirtmedi · `}
                {kadin.length} kadın, {erkek.length} erkek veri noktası
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {erkek.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-blue-600 font-semibold mb-1">Erkek ({erkek.length} veri)</p>
                    <p className="text-xl font-bold text-slate-900">{formatMaas(erkekOrt)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">ortalama aylık brüt</p>
                  </div>
                )}
                {kadin.length > 0 && (
                  <div className="bg-pink-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-pink-600 font-semibold mb-1">Kadın ({kadin.length} veri)</p>
                    <p className="text-xl font-bold text-slate-900">{formatMaas(kadinOrt)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">ortalama aylık brüt</p>
                  </div>
                )}
                {ucurumYuzde !== null && (
                  <div className={`${ucurumYuzde > 0 ? "bg-red-50" : "bg-emerald-50"} rounded-xl p-4 text-center`}>
                    <p className={`text-xs font-semibold mb-1 ${ucurumYuzde > 0 ? "text-red-600" : "text-emerald-600"}`}>Maaş Uçurumu</p>
                    <p className="text-xl font-bold text-slate-900">%{Math.abs(ucurumYuzde)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{ucurumYuzde > 0 ? "kadınlar daha az alıyor" : "kadınlar daha fazla alıyor"}</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400">
                * Bu analiz anonim beyana dayalı olup yaş, sektör ve şirket büyüklüğü gibi faktörler kontrol edilmemiştir.
              </p>
            </div>
          )}

          {/* Sektör karşılaştırma */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
            <h2 className="font-bold text-slate-900 mb-4">Sektör Karşılaştırması</h2>
            <div className="space-y-3">
              {sektorIstatistik.map((s, i) => {
                const avg = Math.round(s._avg.maasAylik ?? 0);
                return (
                  <div key={s.sektor}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                        <Link href={`/maaslar?sektor=${encodeURIComponent(s.sektor)}`} className="text-sm text-slate-700 hover:text-blue-600 transition-colors">{s.sektor}</Link>
                        <span className="text-xs text-slate-400">({s._count.sektor})</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{formatMaas(avg)}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(avg / maxSektor) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Şehir + Eğitim yan yana */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-4">Şehre Göre</h2>
              <div className="space-y-2.5">
                {sehirIstatistik.map((s) => {
                  const avg = Math.round(s._avg.maasAylik ?? 0);
                  return (
                    <div key={s.sehir}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{s.sehir}</span>
                        <span className="font-semibold text-slate-900">{formatMaas(avg)}</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(avg / maxSehir) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-4">Eğitime Göre</h2>
              <div className="space-y-3">
                {egitimIstatistik.map((e) => (
                  <div key={e.egitimSeviyesi} className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{e.egitimSeviyesi}</span>
                    <span className="font-semibold text-slate-900 text-sm">{formatMaas(Math.round(e._avg.maasAylik ?? 0))}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Çalışma Şekline Göre</h3>
                <div className="space-y-2">
                  {calismaSekliIstatistik.map((c) => (
                    <div key={c.calismaSekli} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">{c.calismaSekli}</span>
                      <span className="font-semibold text-slate-900">{formatMaas(Math.round(c._avg.maasAylik ?? 0))}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Deneyim korelasyonu */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4">Deneyim–Maaş Korelasyonu</h2>
            <div className="space-y-3">
              {deneyimGruplari.map((g) => {
                const maxOrt = Math.max(...deneyimGruplari.map((d) => d.ortalama));
                return (
                  <div key={g.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{g.label} yıl <span className="text-slate-400">({g.adet} kişi)</span></span>
                      <span className="font-semibold text-slate-900">{g.ortalama > 0 ? formatMaas(g.ortalama) : "—"}</span>
                    </div>
                    {g.ortalama > 0 && (
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(g.ortalama / maxOrt) * 100}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

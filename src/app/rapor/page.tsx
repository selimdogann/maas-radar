export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { formatMaas, hesaplaPercentile } from "@/lib/stats";
import PrintButton from "./PrintButton";

function ortalama(nums: number[]) {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export default async function RaporPage() {
  const [toplamMaas, toplamForum, toplamMulakat, toplamSirket] = await Promise.all([
    prisma.salary.count(),
    prisma.forumPost.count(),
    prisma.interview.count(),
    prisma.companyReview.count(),
  ]);

  const tumMaaslar = await prisma.salary.findMany({
    select: { maasAylik: true, sektor: true, sehir: true, deneyimYil: true, calismaSekli: true },
  });

  const sektorIstatistik = await prisma.salary.groupBy({
    by: ["sektor"],
    _avg: { maasAylik: true },
    _count: { sektor: true },
    _max: { maasAylik: true },
    orderBy: { _avg: { maasAylik: "desc" } },
  });

  const sehirIstatistik = await prisma.salary.groupBy({
    by: ["sehir"],
    _avg: { maasAylik: true },
    _count: { sehir: true },
    orderBy: { _avg: { maasAylik: "desc" } },
    take: 8,
  });

  const calismaSekliIstatistik = await prisma.salary.groupBy({
    by: ["calismaSekli"],
    _avg: { maasAylik: true },
    _count: { calismaSekli: true },
    orderBy: { _count: { calismaSekli: "desc" } },
  });

  const tumDegerler = tumMaaslar.map((m) => m.maasAylik);
  const genelOrtalama = ortalama(tumDegerler);
  const p25 = hesaplaPercentile(tumDegerler, 25);
  const p50 = hesaplaPercentile(tumDegerler, 50);
  const p75 = hesaplaPercentile(tumDegerler, 75);
  const p90 = hesaplaPercentile(tumDegerler, 90);
  const maxMaas = Math.max(...(tumDegerler.length ? tumDegerler : [0]));

  const deneyimGruplari = [
    { label: "0–2 yıl", min: 0, max: 2 },
    { label: "3–5 yıl", min: 3, max: 5 },
    { label: "6–10 yıl", min: 6, max: 10 },
    { label: "10+ yıl", min: 11, max: 99 },
  ].map((g) => {
    const grup = tumMaaslar.filter((m) => m.deneyimYil >= g.min && m.deneyimYil <= g.max);
    return { ...g, ortalama: ortalama(grup.map((m) => m.maasAylik)), adet: grup.length };
  });

  const yil = new Date().getFullYear();
  const maxSektor = Math.max(...sektorIstatistik.map((s) => s._avg.maasAylik ?? 0));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 print:py-4 print:px-0">
      {/* Başlık */}
      <div className="flex items-start justify-between mb-8 print:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold print:hidden">
              M
            </div>
            <span className="text-blue-600 font-semibold text-sm print:text-black">MaaşRadar</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">{yil} Türkiye Maaş Raporu</h1>
          <p className="text-slate-500 text-sm">
            {toplamMaas} anonim veri noktasından derlendi · {new Date().toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
          </p>
        </div>
        <PrintButton />
      </div>

      {/* Platform istatistikleri */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Maaş Verisi", value: toplamMaas, icon: "💰" },
          { label: "Forum Konusu", value: toplamForum, icon: "💬" },
          { label: "Mülakat Deneyimi", value: toplamMulakat, icon: "🎤" },
          { label: "Şirket Yorumu", value: toplamSirket, icon: "🏢" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-2xl font-bold text-slate-900">{item.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Genel maaş dağılımı */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
        <h2 className="font-bold text-slate-900 text-lg mb-1">Genel Maaş Dağılımı</h2>
        <p className="text-slate-500 text-sm mb-5">Tüm sektörler · Aylık brüt (TL)</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
          {[
            { label: "Ortalama", value: genelOrtalama, color: "text-blue-600" },
            { label: "Medyan (P50)", value: p50, color: "text-slate-900" },
            { label: "Alt Çeyrek (P25)", value: p25, color: "text-slate-600" },
            { label: "Üst Çeyrek (P75)", value: p75, color: "text-emerald-600" },
            { label: "Top %10 (P90)", value: p90, color: "text-purple-600" },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center">
              <div className={`text-lg font-bold ${item.color}`}>{formatMaas(item.value)}</div>
              <div className="text-xs text-slate-500 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
        {/* Görsel bar */}
        <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
          {tumDegerler.length > 0 && (
            <>
              <div
                className="absolute h-full bg-gradient-to-r from-blue-200 via-emerald-400 to-purple-500 rounded-full"
                style={{ left: `${(p25 / maxMaas) * 100}%`, right: `${100 - (p90 / maxMaas) * 100}%` }}
              />
              <div className="absolute h-full w-0.5 bg-blue-600" style={{ left: `${(p50 / maxMaas) * 100}%` }} />
            </>
          )}
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>0 ₺</span>
          <span>{formatMaas(maxMaas)}</span>
        </div>
      </div>

      {/* Sektör bazlı */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
        <h2 className="font-bold text-slate-900 text-lg mb-1">Sektöre Göre Ortalama Maaş</h2>
        <p className="text-slate-500 text-sm mb-5">En yüksekten en düşüğe sıralı</p>
        <div className="space-y-3">
          {sektorIstatistik.map((s, i) => {
            const avg = Math.round(s._avg.maasAylik ?? 0);
            const oran = maxSektor > 0 ? (avg / maxSektor) * 100 : 0;
            return (
              <div key={s.sektor}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                    <span className="text-sm font-medium text-slate-700">{s.sektor}</span>
                    <span className="text-xs text-slate-400">({s._count.sektor} veri)</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{formatMaas(avg)}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${oran}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Şehir + Deneyim yan yana */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Şehir */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">En Yüksek Maaşlı Şehirler</h2>
          <div className="space-y-2.5">
            {sehirIstatistik.map((s, i) => (
              <div key={s.sehir} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                  <span className="text-sm text-slate-700">{s.sehir}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{formatMaas(Math.round(s._avg.maasAylik ?? 0))}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deneyim */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">Deneyime Göre Maaş</h2>
          <div className="space-y-2.5">
            {deneyimGruplari.map((g) => (
              <div key={g.label} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-700">{g.label}</span>
                  <span className="text-xs text-slate-400">({g.adet} kişi)</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{g.adet > 0 ? formatMaas(g.ortalama) : "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Çalışma şekli */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <h2 className="font-bold text-slate-900 mb-4">Çalışma Şekline Göre Maaş</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {calismaSekliIstatistik.map((c) => (
            <div key={c.calismaSekli} className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-lg font-bold text-slate-900">{formatMaas(Math.round(c._avg.maasAylik ?? 0))}</div>
              <div className="text-sm text-slate-600 mt-0.5">{c.calismaSekli}</div>
              <div className="text-xs text-slate-400 mt-1">{c._count.calismaSekli} veri</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 print:mt-8">
        <p>Bu rapor MaaşRadar tarafından anonim kullanıcı verileri kullanılarak oluşturulmuştur.</p>
        <p className="mt-1">maasradar.com · {yil}</p>
      </div>
    </div>
  );
}

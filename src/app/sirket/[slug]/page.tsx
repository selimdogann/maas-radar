import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatMaas, hesaplaPercentileGrubu } from "@/lib/stats";
import Link from "next/link";

export const dynamic = "force-dynamic";

function ort(nums: number[]) {
  if (!nums.length) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function yildiz(n: number) {
  const tam = Math.round(n);
  return "★".repeat(tam) + "☆".repeat(5 - tam);
}

export default async function SirketDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sirketAdi = decodeURIComponent(slug);

  const [maaslar, yorumlar, mulakatlar] = await Promise.all([
    prisma.salary.findMany({ where: { sirket: { contains: sirketAdi } }, orderBy: { olusturuldu: "desc" } }),
    prisma.companyReview.findMany({ where: { sirket: { contains: sirketAdi } }, orderBy: { olusturuldu: "desc" } }),
    prisma.interview.findMany({ where: { sirket: { contains: sirketAdi } }, orderBy: { olusturuldu: "desc" }, take: 5 }),
  ]);

  if (maaslar.length === 0 && yorumlar.length === 0 && mulakatlar.length === 0) notFound();

  const istatistik = maaslar.length > 0 ? hesaplaPercentileGrubu(maaslar.map((m) => m.maasAylik)) : null;

  const puanlar = yorumlar.length > 0 ? {
    kultur: ort(yorumlar.map((y) => y.kultur)),
    isYasamDengesi: ort(yorumlar.map((y) => y.isYasamDengesi)),
    yonetim: ort(yorumlar.map((y) => y.yonetim)),
    kariyer: ort(yorumlar.map((y) => y.kariyer)),
    maasYanHaklar: ort(yorumlar.map((y) => y.maasYanHaklar)),
  } : null;

  const genelPuan = puanlar ? ort(Object.values(puanlar)) : 0;
  const tavsiyeOrani = yorumlar.length > 0 ? Math.round((yorumlar.filter((y) => y.tavsiyeEder).length / yorumlar.length) * 100) : 0;

  const pozisyonDagilim = maaslar.reduce<Record<string, number[]>>((acc, m) => {
    if (!acc[m.pozisyon]) acc[m.pozisyon] = [];
    acc[m.pozisyon].push(m.maasAylik);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-3">
              {sirketAdi.slice(0, 1)}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{sirketAdi}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
              {maaslar.length > 0 && <span>{maaslar.length} maaş verisi</span>}
              {yorumlar.length > 0 && <span>{yorumlar.length} çalışan yorumu</span>}
              {mulakatlar.length > 0 && <span>{mulakatlar.length} mülakat deneyimi</span>}
            </div>
          </div>
          {genelPuan > 0 && (
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-900">{genelPuan}</div>
              <div className="text-yellow-400">{yildiz(genelPuan)}</div>
              <div className="text-xs text-slate-400 mt-1">%{tavsiyeOrani} tavsiye eder</div>
            </div>
          )}
        </div>
      </div>

      {/* Maaş istatistikleri */}
      {istatistik && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6">
          <h2 className="font-bold text-slate-900 mb-4">Maaş Verileri</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
            {[
              { label: "P25", value: istatistik.p25 },
              { label: "Medyan", value: istatistik.p50, highlight: true },
              { label: "P75", value: istatistik.p75 },
              { label: "P90", value: istatistik.p90 },
              { label: "Ortalama", value: istatistik.ortalama },
            ].map((item) => (
              <div key={item.label} className={`${item.highlight ? "bg-blue-50" : "bg-slate-50"} rounded-xl p-3 text-center`}>
                <div className={`text-base font-bold ${item.highlight ? "text-blue-700" : "text-slate-900"}`}>{formatMaas(item.value)}</div>
                <div className="text-xs text-slate-400 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Pozisyon bazlı */}
          {Object.keys(pozisyonDagilim).length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600 mb-2">Pozisyona göre</p>
              {Object.entries(pozisyonDagilim).map(([poz, liste]) => {
                const avgPoz = Math.round(liste.reduce((a, b) => a + b, 0) / liste.length);
                return (
                  <div key={poz} className="flex justify-between items-center text-sm py-1.5 border-b border-slate-50 last:border-0">
                    <Link href={`/pozisyon/${encodeURIComponent(poz)}`} className="text-slate-700 hover:text-blue-600 transition-colors">{poz}</Link>
                    <span className="font-semibold text-slate-900">{formatMaas(avgPoz)} <span className="text-slate-400 text-xs font-normal">({liste.length})</span></span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Şirket puanları */}
      {puanlar && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6">
          <h2 className="font-bold text-slate-900 mb-4">Çalışan Değerlendirmesi</h2>
          <div className="space-y-2.5">
            {[
              { label: "Şirket Kültürü", value: puanlar.kultur },
              { label: "İş-Yaşam Dengesi", value: puanlar.isYasamDengesi },
              { label: "Yönetim Kalitesi", value: puanlar.yonetim },
              { label: "Kariyer Gelişimi", value: puanlar.kariyer },
              { label: "Maaş & Yan Haklar", value: puanlar.maasYanHaklar },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-40 shrink-0">{item.label}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.value >= 4 ? "bg-emerald-400" : item.value >= 3 ? "bg-blue-400" : "bg-yellow-400"}`}
                    style={{ width: `${(item.value / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-900 w-8 text-right">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-right">
            <Link href={`/sirketler?sirket=${encodeURIComponent(sirketAdi)}`} className="text-xs text-blue-600 hover:underline">
              Tüm yorumları gör →
            </Link>
          </div>
        </div>
      )}

      {/* Mülakat deneyimleri */}
      {mulakatlar.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">Mülakat Deneyimleri</h2>
          <div className="space-y-3">
            {mulakatlar.map((m) => (
              <div key={m.id} className="bg-slate-50 rounded-xl p-4">
                <div className="flex gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{m.pozisyon}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.zorluk === "Kolay" ? "bg-green-50 text-green-700" : m.zorluk === "Zor" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"}`}>{m.zorluk}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.sonuc === "Teklif Aldım" ? "bg-emerald-50 text-emerald-700" : m.sonuc === "Reddedildim" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"}`}>{m.sonuc}</span>
                </div>
                <p className="text-sm text-slate-600">{m.surec}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 text-right">
            <Link href={`/mulakat?sirket=${encodeURIComponent(sirketAdi)}`} className="text-xs text-blue-600 hover:underline">
              Tüm mülakat deneyimleri →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

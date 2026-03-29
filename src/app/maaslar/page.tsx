import { prisma } from "@/lib/db";
import { hesaplaPercentileGrubu, formatMaas } from "@/lib/stats";
import Link from "next/link";
import GiveToGet from "@/components/GiveToGet";

function maskSirket(sirket: string) {
  if (sirket.length <= 3) return sirket + "***";
  return sirket.slice(0, 3) + "***";
}

const SEKTORLER = [
  "Yazılım & Teknoloji", "Finans & Bankacılık", "Sağlık", "Eğitim",
  "Perakende & E-Ticaret", "Üretim & Sanayi", "Medya & Reklam",
  "Lojistik & Ulaşım", "Hukuk", "İnşaat & Gayrimenkul", "Diğer",
];

const SEHIRLER = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya",
  "Adana", "Gaziantep", "Kocaeli", "Diğer",
];

const SEKTOR_RENKLER: Record<string, string> = {
  "Yazılım & Teknoloji": "bg-blue-50 text-blue-700",
  "Finans & Bankacılık": "bg-green-50 text-green-700",
  "Sağlık": "bg-red-50 text-red-700",
  "Eğitim": "bg-yellow-50 text-yellow-700",
  "Perakende & E-Ticaret": "bg-purple-50 text-purple-700",
  "Üretim & Sanayi": "bg-orange-50 text-orange-700",
  "Medya & Reklam": "bg-pink-50 text-pink-700",
  "Lojistik & Ulaşım": "bg-cyan-50 text-cyan-700",
};

function getSektorRenk(sektor: string) {
  return SEKTOR_RENKLER[sektor] ?? "bg-slate-100 text-slate-700";
}

export default async function MaaslarPage({
  searchParams,
}: {
  searchParams: Promise<{ sektor?: string; sehir?: string; siralama?: string }>;
}) {
  const params = await searchParams;
  const { sektor, sehir, siralama } = params;

  const maaslar = await prisma.salary.findMany({
    where: {
      sektor: sektor || undefined,
      sehir: sehir || undefined,
    },
    orderBy:
      siralama === "yuksek" ? { maasAylik: "desc" }
      : siralama === "dusuk" ? { maasAylik: "asc" }
      : { olusturuldu: "desc" },
  });

  const agg = await prisma.salary.aggregate({
    where: { sektor: sektor || undefined, sehir: sehir || undefined },
    _avg: { maasAylik: true },
    _max: { maasAylik: true },
    _min: { maasAylik: true },
    _count: true,
  });

  const percentiler = hesaplaPercentileGrubu(maaslar.map((m) => m.maasAylik));
  const aktifFiltre = sektor || sehir;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Başlık */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maaşlar</h1>
          <p className="text-slate-500 text-sm mt-1">
            {maaslar.length} kayıt
            {sektor && <span> · {sektor}</span>}
            {sehir && <span> · {sehir}</span>}
          </p>
        </div>
        <Link
          href="/maas-ekle"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          + Maaş Ekle
        </Link>
      </div>

      {/* Filtreler */}
      <form
        method="GET"
        className="bg-white rounded-xl border border-slate-200 p-5 mb-6 flex flex-wrap gap-3 items-end shadow-sm"
      >
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Sektör</label>
          <select
            name="sektor"
            defaultValue={sektor || ""}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Tüm Sektörler</option>
            {SEKTORLER.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Şehir</label>
          <select
            name="sehir"
            defaultValue={sehir || ""}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Tüm Şehirler</option>
            {SEHIRLER.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Sıralama</label>
          <select
            name="siralama"
            defaultValue={siralama || ""}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">En Yeni</option>
            <option value="yuksek">En Yüksek</option>
            <option value="dusuk">En Düşük</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Filtrele
          </button>
          {aktifFiltre && (
            <Link
              href="/maaslar"
              className="text-slate-500 hover:text-slate-700 px-4 py-2 rounded-lg border border-slate-300 font-medium transition-colors text-sm"
            >
              Temizle
            </Link>
          )}
        </div>
      </form>

      {/* Özet + Percentile */}
      {maaslar.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-800 text-sm">Maaş Dağılımı</h2>
            <span className="text-xs text-slate-400">{agg._count} kayıt</span>
          </div>
          <div className="space-y-3 mb-4">
            {[
              { label: "P25 — Alt çeyrek", value: percentiler.p25, renk: "bg-slate-300", bar: 25 },
              { label: "P50 — Medyan", value: percentiler.p50, renk: "bg-blue-500", bar: 50 },
              { label: "P75 — Üst çeyrek", value: percentiler.p75, renk: "bg-emerald-500", bar: 75 },
              { label: "P90 — En yüksek %10", value: percentiler.p90, renk: "bg-violet-500", bar: 90 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-28 text-xs text-slate-500 shrink-0">{item.label}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${item.renk}`} style={{ width: `${item.bar}%` }} />
                </div>
                <div className="w-28 text-xs font-semibold text-slate-800 text-right">{formatMaas(item.value)}</div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
            <span>Ortalama: <strong className="text-slate-700">{formatMaas(percentiler.ortalama)}</strong></span>
            <Link href={`/hesapla${sektor ? `?sektor=${encodeURIComponent(sektor)}` : ""}`} className="text-blue-600 hover:underline font-medium">
              Kişisel hesapla →
            </Link>
          </div>
        </div>
      )}

      {/* Liste */}
      {maaslar.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Sonuç bulunamadı</h3>
          <p className="text-slate-400 text-sm mb-5">Farklı filtreler dene veya ilk maaşı ekle.</p>
          <Link href="/maas-ekle" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
            Maaş Ekle
          </Link>
        </div>
      ) : (
        <GiveToGet>
        <div className="space-y-3">
          {maaslar.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-slate-900">{maskSirket(m.sirket)}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSektorRenk(m.sektor)}`}>
                      {m.sektor.split(" & ")[0]}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {m.calismaSekli}
                    </span>
                  </div>
                  <div className="text-slate-600 text-sm font-medium mb-2">{m.pozisyon}</div>
                  <div className="flex gap-4 text-xs text-slate-400 flex-wrap">
                    <span>📍 {m.sehir}</span>
                    <span>💼 {m.deneyimYil} yıl deneyim</span>
                    <span>🎓 {m.egitimSeviyesi}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-900">
                    {formatMaas(m.maasAylik)}
                    <span className="text-xs font-normal text-slate-400"> /ay</span>
                  </div>
                  {m.bonusYillik && (
                    <div className="text-xs text-emerald-600 font-medium mt-0.5">
                      + {formatMaas(m.bonusYillik)} bonus
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </GiveToGet>
      )}
    </div>
  );
}

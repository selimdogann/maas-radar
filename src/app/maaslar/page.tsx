import { prisma } from "@/lib/db";
import Link from "next/link";

function formatMaas(maas: number) {
  return new Intl.NumberFormat("tr-TR").format(maas) + " ₺";
}

function maskSirket(sirket: string) {
  if (sirket.length <= 3) return sirket + "***";
  return sirket.slice(0, 3) + "***";
}

const SEKTORLER = [
  "Yazılım & Teknoloji",
  "Finans & Bankacılık",
  "Sağlık",
  "Eğitim",
  "Perakende & E-Ticaret",
  "Üretim & Sanayi",
  "Medya & Reklam",
  "Lojistik & Ulaşım",
  "Hukuk",
  "İnşaat & Gayrimenkul",
  "Diğer",
];

const SEHIRLER = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Gaziantep",
  "Kocaeli",
  "Diğer",
];

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
      siralama === "yuksek"
        ? { maasAylik: "desc" }
        : siralama === "dusuk"
        ? { maasAylik: "asc" }
        : { olusturuldu: "desc" },
  });

  const agg = await prisma.salary.aggregate({
    where: {
      sektor: sektor || undefined,
      sehir: sehir || undefined,
    },
    _avg: { maasAylik: true },
    _max: { maasAylik: true },
    _min: { maasAylik: true },
    _count: true,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Maaşlar</h1>
          <p className="text-gray-500">
            {maaslar.length} kayıt bulundu
          </p>
        </div>
        <Link
          href="/maas-ekle"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + Maaş Ekle
        </Link>
      </div>

      {/* Filtreler */}
      <form method="GET" className="bg-white rounded-xl border border-gray-200 p-5 mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sektör</label>
          <select
            name="sektor"
            defaultValue={sektor || ""}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tümü</option>
            {SEKTORLER.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
          <select
            name="sehir"
            defaultValue={sehir || ""}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tümü</option>
            {SEHIRLER.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
          <select
            name="siralama"
            defaultValue={siralama || ""}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">En Yeni</option>
            <option value="yuksek">En Yüksek Maaş</option>
            <option value="dusuk">En Düşük Maaş</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Filtrele
        </button>
        {(sektor || sehir) && (
          <Link
            href="/maaslar"
            className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg border border-gray-300 font-medium transition-colors"
          >
            Temizle
          </Link>
        )}
      </form>

      {/* Özet İstatistikler */}
      {maaslar.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {agg._count}
            </div>
            <div className="text-xs text-gray-500 mt-1">Kayıt</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatMaas(Math.round(agg._avg.maasAylik ?? 0))}
            </div>
            <div className="text-xs text-gray-500 mt-1">Ortalama</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatMaas(agg._max.maasAylik ?? 0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">En Yüksek</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatMaas(agg._min.maasAylik ?? 0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">En Düşük</div>
          </div>
        </div>
      )}

      {/* Liste */}
      {maaslar.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Sonuç bulunamadı</h3>
          <p className="text-gray-500 mb-6">Farklı filtreler dene veya ilk maaşı ekle.</p>
          <Link
            href="/maas-ekle"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Maaş Ekle
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {maaslar.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-bold text-gray-900 text-lg">
                      {maskSirket(m.sirket)}
                    </span>
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {m.sektor}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      {m.calismaSekli}
                    </span>
                  </div>
                  <div className="text-gray-600 font-medium mb-2">{m.pozisyon}</div>
                  <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
                    <span>📍 {m.sehir}</span>
                    <span>💼 {m.deneyimYil} yıl deneyim</span>
                    <span>🎓 {m.egitimSeviyesi}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatMaas(m.maasAylik)}
                    <span className="text-sm font-normal text-gray-400"> /ay</span>
                  </div>
                  {m.bonusYillik && (
                    <div className="text-sm text-green-600 font-medium">
                      + {formatMaas(m.bonusYillik)} /yıl bonus
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

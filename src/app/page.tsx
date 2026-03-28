import Link from "next/link";
import { prisma } from "@/lib/db";

async function getStats() {
  const toplam = await prisma.salary.count();
  const agg = await prisma.salary.aggregate({
    _avg: { maasAylik: true },
    _max: { maasAylik: true },
  });
  const sonMaaslar = await prisma.salary.findMany({
    orderBy: { olusturuldu: "desc" },
    take: 6,
  });
  const sektorler = await prisma.salary.groupBy({
    by: ["sektor"],
    _count: { sektor: true },
    _avg: { maasAylik: true },
    orderBy: { _count: { sektor: "desc" } },
    take: 6,
  });
  return { toplam, agg, sonMaaslar, sektorler };
}

function formatMaas(maas: number) {
  return new Intl.NumberFormat("tr-TR").format(maas) + " ₺";
}

function maskSirket(sirket: string) {
  if (sirket.length <= 3) return sirket + "***";
  return sirket.slice(0, 3) + "***";
}

export default async function HomePage() {
  const { toplam, agg, sonMaaslar, sektorler } = await getStats();
  const ortalama = Math.round(agg._avg.maasAylik ?? 0);
  const maksimum = agg._max.maasAylik ?? 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Gerçek Maaşları Keşfet
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Türkiye&apos;deki şirketlerin gerçek maaşlarını anonim olarak öğren.
          Adil ücret talep etmek için doğru veriyi kullan.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/maaslar"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            Maaşlara Bak
          </Link>
          <Link
            href="/maas-ekle"
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors"
          >
            Maaşını Paylaş
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {toplam.toLocaleString("tr-TR")}
          </div>
          <div className="text-gray-600 font-medium">Paylaşılan Maaş</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {ortalama > 0 ? formatMaas(ortalama) : "–"}
          </div>
          <div className="text-gray-600 font-medium">Ortalama Aylık Maaş</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {maksimum > 0 ? formatMaas(maksimum) : "–"}
          </div>
          <div className="text-gray-600 font-medium">En Yüksek Maaş</div>
        </div>
      </div>

      {/* Sektörler */}
      {sektorler.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Sektöre Göre Ortalama Maaş
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sektorler.map((s) => (
              <div
                key={s.sektor}
                className="bg-white rounded-xl p-5 border border-gray-200 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-gray-900">{s.sektor}</div>
                  <div className="text-sm text-gray-500">
                    {s._count.sektor} kayıt
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {formatMaas(Math.round(s._avg.maasAylik ?? 0))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Son Eklenenler */}
      {sonMaaslar.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Son Paylaşılan Maaşlar
            </h2>
            <Link href="/maaslar" className="text-blue-600 font-medium hover:underline">
              Tümünü gör →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sonMaaslar.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">{maskSirket(m.sirket)}</div>
                    <div className="text-sm text-gray-500">{m.pozisyon}</div>
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                    {m.sektor}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatMaas(m.maasAylik)}
                  <span className="text-sm font-normal text-gray-500"> /ay</span>
                </div>
                <div className="flex gap-3 text-xs text-gray-500 flex-wrap">
                  <span>📍 {m.sehir}</span>
                  <span>💼 {m.deneyimYil} yıl</span>
                  <span>🏠 {m.calismaSekli}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Henüz maaş paylaşılmadı
          </h3>
          <p className="text-gray-500 mb-6">İlk maaşı paylaşan sen ol!</p>
          <Link
            href="/maas-ekle"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Maaşını Paylaş
          </Link>
        </div>
      )}
    </div>
  );
}

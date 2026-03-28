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

export default async function HomePage() {
  const { toplam, agg, sonMaaslar, sektorler } = await getStats();
  const ortalama = Math.round(agg._avg.maasAylik ?? 0);
  const maksimum = agg._max.maasAylik ?? 0;

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Tamamen anonim · Kimlik bilgisi yok
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Türkiye&apos;nin Gerçek<br />Maaş Verisi
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Kariyer.net tahmin gösterir. Glassdoor Türkçe değil. Biz gerçek maaşları topluyoruz — anonim, güncel, güvenilir.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/maaslar"
              className="bg-white text-blue-700 px-7 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Maaşları Keşfet
            </Link>
            <Link
              href="/maas-ekle"
              className="bg-blue-500 text-white border border-blue-400 px-7 py-3 rounded-xl font-semibold hover:bg-blue-400 transition-colors"
            >
              Maaşını Paylaş
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14 -mt-10">
          {[
            { label: "Paylaşılan Maaş", value: toplam > 0 ? toplam.toLocaleString("tr-TR") : "0", color: "text-blue-600", icon: "📊" },
            { label: "Ortalama Maaş", value: ortalama > 0 ? formatMaas(ortalama) : "–", color: "text-emerald-600", icon: "💰" },
            { label: "En Yüksek Maaş", value: maksimum > 0 ? formatMaas(maksimum) : "–", color: "text-violet-600", icon: "🚀" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Sektörler */}
        {sektorler.length > 0 && (
          <div className="mb-14">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-900">Sektöre Göre Maaş</h2>
              <Link href="/maaslar" className="text-blue-600 text-sm font-medium hover:underline">
                Tümünü gör →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sektorler.map((s) => (
                <Link
                  key={s.sektor}
                  href={`/maaslar?sektor=${encodeURIComponent(s.sektor)}`}
                  className="bg-white rounded-xl p-5 border border-slate-200 flex justify-between items-center hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors text-sm">
                      {s.sektor}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{s._count.sektor} kayıt</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      {formatMaas(Math.round(s._avg.maasAylik ?? 0))}
                    </div>
                    <div className="text-xs text-slate-400">ort. /ay</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Son Maaşlar */}
        {sonMaaslar.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-900">Son Paylaşılan Maaşlar</h2>
              <Link href="/maaslar" className="text-blue-600 text-sm font-medium hover:underline">
                Tümünü gör →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sonMaaslar.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-slate-900">{maskSirket(m.sirket)}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{m.pozisyon}</div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSektorRenk(m.sektor)}`}>
                      {m.sektor.split(" & ")[0]}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {formatMaas(m.maasAylik)}
                    <span className="text-sm font-normal text-slate-400"> /ay</span>
                  </div>
                  {m.bonusYillik && (
                    <div className="text-xs text-emerald-600 font-medium mb-2">
                      + {formatMaas(m.bonusYillik)} yıllık bonus
                    </div>
                  )}
                  <div className="flex gap-3 text-xs text-slate-400 flex-wrap pt-2 border-t border-slate-100">
                    <span>📍 {m.sehir}</span>
                    <span>💼 {m.deneyimYil} yıl</span>
                    <span>🏠 {m.calismaSekli}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Henüz maaş yok</h3>
            <p className="text-slate-400 mb-6 text-sm">İlk maaşı paylaşan sen ol!</p>
            <Link href="/maas-ekle" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
              Maaş Paylaş
            </Link>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Sen de katkıda bulun</h3>
          <p className="text-blue-100 text-sm mb-5">
            Maaşını paylaşarak hem veriyi zenginleştirirsin hem de başkalarına yardım etmiş olursun.
          </p>
          <Link
            href="/maas-ekle"
            className="bg-white text-blue-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm inline-block"
          >
            Anonim Maaş Paylaş
          </Link>
        </div>
      </div>
    </div>
  );
}

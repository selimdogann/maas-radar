import { prisma } from "@/lib/db";
import FreelanceForm from "./FreelanceForm";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR").format(n) + " ₺";
}

function ort(nums: number[]) {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export default async function FreelancePage() {
  const veriler = await prisma.freelanceRate.findMany({
    orderBy: { olusturuldu: "desc" },
    take: 50,
  });

  const sektorOzet = await prisma.freelanceRate.groupBy({
    by: ["sektor"],
    _avg: { saatlikUcret: true, gunlukUcret: true },
    _count: { sektor: true },
    orderBy: { _avg: { gunlukUcret: "desc" } },
  });

  const tumSaatlik = veriler.filter((v) => v.saatlikUcret).map((v) => v.saatlikUcret!);
  const tumGunluk = veriler.filter((v) => v.gunlukUcret).map((v) => v.gunlukUcret!);
  const avgSaatlik = ort(tumSaatlik);
  const avgGunluk = ort(tumGunluk);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Freelance & Serbest Çalışan Ücretleri</h1>
        <p className="text-slate-500 text-sm">Saatlik ve günlük ücretleri anonim olarak paylaş, piyasayı keşfet.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="font-semibold text-slate-800 text-sm mb-4">Ücret Paylaş</h2>
            <FreelanceForm />
          </div>

          {/* Özet istatistikler */}
          {veriler.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wide mb-3">Genel Ortalama</h3>
              <div className="space-y-2">
                {avgSaatlik > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Saatlik ortalama</span>
                    <span className="font-bold text-slate-900">{fmt(avgSaatlik)}</span>
                  </div>
                )}
                {avgGunluk > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Günlük ortalama</span>
                    <span className="font-bold text-slate-900">{fmt(avgGunluk)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Toplam veri</span>
                  <span className="font-bold text-slate-900">{veriler.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Sektör özeti */}
          {sektorOzet.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wide mb-3">Sektöre Göre Günlük</h3>
              <div className="space-y-2">
                {sektorOzet.map((s) => (
                  <div key={s.sektor} className="flex justify-between items-center">
                    <span className="text-slate-700 text-sm">{s.sektor.split(" & ")[0]}</span>
                    <div className="text-right">
                      {s._avg.gunlukUcret && <p className="text-xs font-bold text-slate-900">{fmt(Math.round(s._avg.gunlukUcret))}</p>}
                      <p className="text-xs text-slate-400">{s._count.sektor} veri</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ — Liste */}
        <div className="lg:col-span-2 space-y-3">
          {veriler.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="text-4xl mb-3">💻</div>
              <h3 className="font-semibold text-slate-700 mb-1">Henüz veri yok</h3>
              <p className="text-slate-400 text-sm">İlk freelance ücretini sen paylaş!</p>
            </div>
          ) : (
            veriler.map((v) => (
              <div key={v.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                  <div>
                    <span className="font-bold text-slate-900">{v.pozisyon}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="text-slate-500 text-sm">{v.sektor.split(" & ")[0]}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    {v.saatlikUcret && (
                      <span className="bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full">{fmt(v.saatlikUcret)}/sa</span>
                    )}
                    {v.gunlukUcret && (
                      <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">{fmt(v.gunlukUcret)}/gün</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 text-xs text-slate-400">
                  <span>📍 {v.sehir}</span>
                  <span>⏱ {v.deneyimYil} yıl deneyim</span>
                  <span>🖥 {v.calismaSekli}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

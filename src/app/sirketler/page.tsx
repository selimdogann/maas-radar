import { prisma } from "@/lib/db";
import SirketYorumForm from "./SirketYorumForm";
import Link from "next/link";

function yildiz(puan: number) {
  return "★".repeat(puan) + "☆".repeat(5 - puan);
}

function ortalama(degerler: number[]) {
  if (degerler.length === 0) return 0;
  return Math.round((degerler.reduce((a, b) => a + b, 0) / degerler.length) * 10) / 10;
}

export default async function SirketlerPage({
  searchParams,
}: {
  searchParams: Promise<{ sirket?: string }>;
}) {
  const { sirket } = await searchParams;

  const yorumlar = await prisma.companyReview.findMany({
    where: { sirket: sirket ? { contains: sirket } : undefined },
    orderBy: { olusturuldu: "desc" },
    take: 50,
  });

  const sirketOzet = await prisma.companyReview.groupBy({
    by: ["sirket"],
    _count: { sirket: true },
    _avg: {
      kultur: true,
      isYasamDengesi: true,
      yonetim: true,
      kariyer: true,
      maasYanHaklar: true,
    },
    orderBy: { _count: { sirket: "desc" } },
    take: 10,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Şirket Değerlendirmeleri</h1>
        <p className="text-slate-500 text-sm">Çalıştığın şirketi anonim olarak değerlendir.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="font-semibold text-slate-800 text-sm mb-4">Şirket Değerlendir</h2>
            <SirketYorumForm />
          </div>

          {sirketOzet.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wide mb-3">Şirketler</h3>
              <div className="space-y-2">
                {sirketOzet.map((s) => {
                  const genelOrt = ortalama([
                    s._avg.kultur ?? 0, s._avg.isYasamDengesi ?? 0,
                    s._avg.yonetim ?? 0, s._avg.kariyer ?? 0, s._avg.maasYanHaklar ?? 0,
                  ]);
                  return (
                    <Link
                      key={s.sirket}
                      href={`/sirketler?sirket=${encodeURIComponent(s.sirket)}`}
                      className="flex justify-between items-center hover:text-blue-600 transition-colors"
                    >
                      <span className="text-slate-700 text-sm">{s.sirket}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-xs">{"★".repeat(Math.round(genelOrt))}</span>
                        <span className="text-xs text-slate-400">{genelOrt}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sağ */}
        <div className="lg:col-span-2 space-y-3">
          {yorumlar.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="font-semibold text-slate-700 mb-1">Henüz değerlendirme yok</h3>
              <p className="text-slate-400 text-sm">İlk değerlendirmeyi sen yap!</p>
            </div>
          ) : (
            yorumlar.map((y) => {
              const genelOrt = ortalama([y.kultur, y.isYasamDengesi, y.yonetim, y.kariyer, y.maasYanHaklar]);
              return (
                <div key={y.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start mb-3 gap-3 flex-wrap">
                    <div>
                      <span className="font-bold text-slate-900">{y.sirket}</span>
                      <span className="text-slate-400 mx-2">·</span>
                      <span className="text-slate-600 text-sm">{y.pozisyon}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-yellow-400 text-sm">{yildiz(Math.round(genelOrt))}</span>
                      <span className="font-bold text-slate-900">{genelOrt}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${y.tavsiyeEder ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {y.tavsiyeEder ? "Tavsiye eder" : "Tavsiye etmez"}
                      </span>
                    </div>
                  </div>

                  {/* Puanlar */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
                    {[
                      { label: "Kültür", puan: y.kultur },
                      { label: "İş-Yaşam", puan: y.isYasamDengesi },
                      { label: "Yönetim", puan: y.yonetim },
                      { label: "Kariyer", puan: y.kariyer },
                      { label: "Maaş", puan: y.maasYanHaklar },
                    ].map((item) => (
                      <div key={item.label} className="text-center bg-slate-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-slate-900">{item.puan}</div>
                        <div className="text-xs text-slate-400">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Yorumlar */}
                  {y.olumluYon && (
                    <div className="flex gap-2 mb-1.5">
                      <span className="text-emerald-500 text-sm">+</span>
                      <p className="text-slate-600 text-sm">{y.olumluYon}</p>
                    </div>
                  )}
                  {y.olumsuzYon && (
                    <div className="flex gap-2">
                      <span className="text-red-400 text-sm">-</span>
                      <p className="text-slate-600 text-sm">{y.olumsuzYon}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

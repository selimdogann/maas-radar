export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Link from "next/link";

function ortalama(degerler: number[]) {
  if (degerler.length === 0) return 0;
  return Math.round((degerler.reduce((a, b) => a + b, 0) / degerler.length) * 10) / 10;
}

function yildizBar(puan: number) {
  const dolu = Math.round(puan);
  return "★".repeat(dolu) + "☆".repeat(5 - dolu);
}

const KATEGORI_ETIKET: Record<string, string> = {
  kultur: "Kültür",
  isYasamDengesi: "İş-Yaşam",
  yonetim: "Yönetim",
  kariyer: "Kariyer",
  maasYanHaklar: "Maaş",
};

export default async function SirketSiralamaPage() {
  const yorumlar = await prisma.companyReview.findMany({
    select: {
      sirket: true,
      kultur: true,
      isYasamDengesi: true,
      yonetim: true,
      kariyer: true,
      maasYanHaklar: true,
      tavsiyeEder: true,
    },
  });

  // Şirket başına grupla
  const sirketMap = new Map<string, {
    kultur: number[];
    isYasamDengesi: number[];
    yonetim: number[];
    kariyer: number[];
    maasYanHaklar: number[];
    tavsiyeEder: boolean[];
  }>();

  for (const y of yorumlar) {
    if (!sirketMap.has(y.sirket)) {
      sirketMap.set(y.sirket, {
        kultur: [], isYasamDengesi: [], yonetim: [], kariyer: [], maasYanHaklar: [], tavsiyeEder: [],
      });
    }
    const s = sirketMap.get(y.sirket)!;
    s.kultur.push(y.kultur);
    s.isYasamDengesi.push(y.isYasamDengesi);
    s.yonetim.push(y.yonetim);
    s.kariyer.push(y.kariyer);
    s.maasYanHaklar.push(y.maasYanHaklar);
    s.tavsiyeEder.push(y.tavsiyeEder);
  }

  const sirketler = Array.from(sirketMap.entries())
    .map(([sirket, d]) => {
      const kategoriler = {
        kultur: ortalama(d.kultur),
        isYasamDengesi: ortalama(d.isYasamDengesi),
        yonetim: ortalama(d.yonetim),
        kariyer: ortalama(d.kariyer),
        maasYanHaklar: ortalama(d.maasYanHaklar),
      };
      const genelPuan = ortalama(Object.values(kategoriler));
      const tavsiyeOrani = Math.round((d.tavsiyeEder.filter(Boolean).length / d.tavsiyeEder.length) * 100);
      return { sirket, kategoriler, genelPuan, tavsiyeOrani, yorumSayisi: d.kultur.length };
    })
    .sort((a, b) => b.genelPuan - a.genelPuan);

  const rozetler = ["🥇", "🥈", "🥉"];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Şirket Sıralaması</h1>
        <p className="text-slate-500 text-sm">
          Çalışan değerlendirmelerine göre en iyi işyerleri.
          {sirketler.length > 0 && <span className="ml-1 text-slate-400">{sirketler.length} şirket · {yorumlar.length} değerlendirme</span>}
        </p>
      </div>

      {sirketler.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="font-semibold text-slate-700 mb-1">Henüz yeterli veri yok</h3>
          <p className="text-slate-400 text-sm mb-4">Şirket değerlendirmesi yapıldıkça sıralama oluşacak.</p>
          <Link href="/sirketler" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            İlk değerlendirmeyi yap
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sirketler.map((s, i) => (
            <div
              key={s.sirket}
              className={`bg-white rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md ${
                i === 0 ? "border-yellow-300 ring-1 ring-yellow-200" :
                i === 1 ? "border-slate-300 ring-1 ring-slate-100" :
                i === 2 ? "border-orange-200 ring-1 ring-orange-100" :
                "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{rozetler[i] ?? `#${i + 1}`}</span>
                  <div>
                    <h2 className="font-bold text-slate-900 text-lg">{s.sirket}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-yellow-400 text-sm">{yildizBar(s.genelPuan)}</span>
                      <span className="font-bold text-slate-900">{s.genelPuan}</span>
                      <span className="text-xs text-slate-400">/ 5</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
                    s.tavsiyeOrani >= 70 ? "bg-green-50 text-green-700" :
                    s.tavsiyeOrani >= 40 ? "bg-yellow-50 text-yellow-700" :
                    "bg-red-50 text-red-700"
                  }`}>
                    %{s.tavsiyeOrani} tavsiye eder
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1.5 rounded-full">
                    {s.yorumSayisi} yorum
                  </div>
                </div>
              </div>

              {/* Kategori puanları */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                {(Object.entries(s.kategoriler) as [string, number][]).map(([key, val]) => (
                  <div key={key} className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className={`text-xl font-bold ${
                      val >= 4 ? "text-emerald-600" :
                      val >= 3 ? "text-blue-600" :
                      val >= 2 ? "text-yellow-600" :
                      "text-red-500"
                    }`}>{val}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{KATEGORI_ETIKET[key]}</div>
                  </div>
                ))}
              </div>

              {/* Mini progress bars */}
              <div className="space-y-1.5 mt-4">
                {(Object.entries(s.kategoriler) as [string, number][]).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-20 shrink-0">{KATEGORI_ETIKET[key]}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          val >= 4 ? "bg-emerald-400" :
                          val >= 3 ? "bg-blue-400" :
                          val >= 2 ? "bg-yellow-400" :
                          "bg-red-400"
                        }`}
                        style={{ width: `${(val / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600 w-6 text-right">{val}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100">
                <Link
                  href={`/sirketler?sirket=${encodeURIComponent(s.sirket)}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Tüm yorumları gör →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

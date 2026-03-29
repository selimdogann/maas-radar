import { prisma } from "@/lib/db";
import { formatMaas } from "@/lib/stats";
import Link from "next/link";

export const dynamic = "force-dynamic";

const KARIYER_YOLLARI = [
  {
    baslik: "Yazılım Mühendisi",
    sektor: "Yazılım & Teknoloji",
    basamaklar: [
      { unvan: "Junior Developer", deneyim: "0–2 yıl", icon: "🌱" },
      { unvan: "Mid-Level Developer", deneyim: "2–5 yıl", icon: "📈" },
      { unvan: "Senior Developer", deneyim: "5–8 yıl", icon: "⭐" },
      { unvan: "Lead Developer", deneyim: "8–12 yıl", icon: "🚀" },
      { unvan: "Engineering Manager", deneyim: "12+ yıl", icon: "👑" },
    ],
  },
  {
    baslik: "Ürün Yöneticisi",
    sektor: "Yazılım & Teknoloji",
    basamaklar: [
      { unvan: "Associate PM", deneyim: "0–2 yıl", icon: "🌱" },
      { unvan: "Product Manager", deneyim: "2–5 yıl", icon: "📈" },
      { unvan: "Senior PM", deneyim: "5–8 yıl", icon: "⭐" },
      { unvan: "Group PM", deneyim: "8–12 yıl", icon: "🚀" },
      { unvan: "VP of Product", deneyim: "12+ yıl", icon: "👑" },
    ],
  },
  {
    baslik: "Veri Bilimi",
    sektor: "Yazılım & Teknoloji",
    basamaklar: [
      { unvan: "Data Analyst", deneyim: "0–2 yıl", icon: "🌱" },
      { unvan: "Data Scientist", deneyim: "2–5 yıl", icon: "📈" },
      { unvan: "Senior Data Scientist", deneyim: "5–8 yıl", icon: "⭐" },
      { unvan: "ML Engineer / Lead", deneyim: "8–12 yıl", icon: "🚀" },
      { unvan: "Head of Data", deneyim: "12+ yıl", icon: "👑" },
    ],
  },
  {
    baslik: "Finans",
    sektor: "Finans & Bankacılık",
    basamaklar: [
      { unvan: "Finansal Analist", deneyim: "0–2 yıl", icon: "🌱" },
      { unvan: "Kıdemli Analist", deneyim: "2–5 yıl", icon: "📈" },
      { unvan: "Müdür Yardımcısı", deneyim: "5–8 yıl", icon: "⭐" },
      { unvan: "Müdür", deneyim: "8–12 yıl", icon: "🚀" },
      { unvan: "Direktör / CFO", deneyim: "12+ yıl", icon: "👑" },
    ],
  },
];

function ort(nums: number[]) {
  if (!nums.length) return null;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export default async function KariyerYoluPage() {
  // Her yol için DB'den gerçek maaş verisi çek
  const sektorMaaslar = await prisma.salary.findMany({
    select: { pozisyon: true, deneyimYil: true, maasAylik: true, sektor: true },
  });

  function deneyimAralik(min: number, max: number, sektor: string) {
    const grup = sektorMaaslar.filter(
      (m) => m.deneyimYil >= min && m.deneyimYil <= max && m.sektor.includes(sektor.split(" & ")[0])
    );
    return ort(grup.map((m) => m.maasAylik));
  }

  const ARALIKLAR = [
    { min: 0, max: 2 },
    { min: 2, max: 5 },
    { min: 5, max: 8 },
    { min: 8, max: 12 },
    { min: 12, max: 99 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Kariyer Yolu & Maaş Progressionu</h1>
        <p className="text-slate-500 text-sm">Deneyim arttıkça maaşın nasıl değişir? Sektöre göre kariyer basamakları.</p>
      </div>

      <div className="space-y-8">
        {KARIYER_YOLLARI.map((yol) => (
          <div key={yol.baslik} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="font-bold text-white text-lg">{yol.baslik}</h2>
              <p className="text-blue-200 text-sm">{yol.sektor}</p>
            </div>

            <div className="p-6">
              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-slate-200" />
                <div className="space-y-6">
                  {yol.basamaklar.map((basamak, i) => {
                    const aralik = ARALIKLAR[i];
                    const maas = deneyimAralik(aralik.min, aralik.max, yol.sektor);
                    return (
                      <div key={i} className="flex gap-5 items-start relative">
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center text-lg shrink-0 z-10">
                          {basamak.icon}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <p className="font-bold text-slate-900">{basamak.unvan}</p>
                              <p className="text-xs text-slate-400">{basamak.deneyim}</p>
                            </div>
                            {maas ? (
                              <div className="text-right">
                                <p className="font-bold text-blue-600">{formatMaas(maas)}</p>
                                <p className="text-xs text-slate-400">ort. aylık brüt</p>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-300">veri yok</span>
                            )}
                          </div>
                          {maas && i > 0 && (() => {
                            const onceki = deneyimAralik(ARALIKLAR[i - 1].min, ARALIKLAR[i - 1].max, yol.sektor);
                            if (!onceki) return null;
                            const artis = Math.round(((maas - onceki) / onceki) * 100);
                            return (
                              <div className="mt-1.5">
                                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                  <span>↑</span> Önceki basamaktan %{artis} artış
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
                <p className="text-xs text-slate-400">Veriler anonim katılımcı beyanlarına dayanmaktadır</p>
                <Link href={`/maaslar?sektor=${encodeURIComponent(yol.sektor)}`} className="text-xs text-blue-600 hover:underline">
                  {yol.sektor} maaşları →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white text-center">
        <p className="font-bold mb-2">Veriyi zenginleştir</p>
        <p className="text-blue-100 text-sm mb-4">Kendi deneyim ve maaş bilgini ekleyerek kariyer yollarını daha doğru hale getir.</p>
        <Link href="/maas-ekle" className="bg-white text-blue-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors">
          Maaş Ekle
        </Link>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/db";
import { hesaplaPercentileGrubu, formatMaas } from "@/lib/stats";
import Link from "next/link";
import HesaplaForm from "./HesaplaForm";

const SEKTORLER = [
  "Yazılım & Teknoloji", "Finans & Bankacılık", "Sağlık", "Eğitim",
  "Perakende & E-Ticaret", "Üretim & Sanayi", "Medya & Reklam",
  "Lojistik & Ulaşım", "Hukuk", "İnşaat & Gayrimenkul", "Diğer",
];

const SEHIRLER = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya",
  "Adana", "Gaziantep", "Kocaeli", "Diğer",
];

async function getSonuc(params: {
  sektor?: string;
  sehir?: string;
  deneyimMin?: number;
  deneyimMax?: number;
  egitim?: string;
}) {
  const { sektor, sehir, deneyimMin, deneyimMax, egitim } = params;

  if (!sektor) return null;

  const maaslar = await prisma.salary.findMany({
    where: {
      sektor,
      sehir: sehir || undefined,
      egitimSeviyesi: egitim || undefined,
      deneyimYil: {
        gte: deneyimMin ?? 0,
        lte: deneyimMax ?? 50,
      },
    },
    select: { maasAylik: true, pozisyon: true, sirket: true },
  });

  if (maaslar.length < 3) return { yetersiz: true, adet: maaslar.length };

  const degerler = maaslar.map((m) => m.maasAylik);
  return { ...hesaplaPercentileGrubu(degerler), yetersiz: false };
}

export default async function HesaplaPage({
  searchParams,
}: {
  searchParams: Promise<{
    sektor?: string;
    sehir?: string;
    deneyimMin?: string;
    deneyimMax?: string;
    egitim?: string;
  }>;
}) {
  const params = await searchParams;
  const sonuc = await getSonuc({
    sektor: params.sektor,
    sehir: params.sehir,
    deneyimMin: params.deneyimMin ? parseInt(params.deneyimMin) : undefined,
    deneyimMax: params.deneyimMax ? parseInt(params.deneyimMax) : undefined,
    egitim: params.egitim,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Başlık */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl text-3xl mb-4">
          🎯
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Maaşım Ne Olmalı?</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Sektörünü, şehrini ve deneyimini gir — gerçek verilerden hesaplanan piyasa değerini gör.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <HesaplaForm
          sektorler={SEKTORLER}
          sehirler={SEHIRLER}
          varsayilan={params}
        />
      </div>

      {/* Sonuç */}
      {sonuc && !sonuc.yetersiz && "p50" in sonuc && (
        <div className="space-y-6">
          {/* Başlık */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
            <p className="text-blue-100 text-sm mb-1">Piyasa Ortancası (Medyan)</p>
            <div className="text-4xl font-bold mb-1">{formatMaas(sonuc.p50)}</div>
            <p className="text-blue-200 text-xs">{sonuc.adet} veri noktasına göre hesaplandı</p>
          </div>

          {/* Dağılım */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-5">Maaş Dağılımı</h2>

            <div className="space-y-4">
              {[
                { label: "Alt Çeyrek (P25)", value: sonuc.p25, color: "bg-slate-400", yuzde: 25, aciklama: "Çalışanların %25'i bu maaşın altında" },
                { label: "Medyan (P50)", value: sonuc.p50, color: "bg-blue-500", yuzde: 50, aciklama: "Tam orta nokta" },
                { label: "Üst Çeyrek (P75)", value: sonuc.p75, color: "bg-emerald-500", yuzde: 75, aciklama: "Çalışanların %25'i bu maaşın üstünde" },
                { label: "En Yüksek %10 (P90)", value: sonuc.p90, color: "bg-violet-500", yuzde: 90, aciklama: "En yüksek kazanan %10" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div>
                      <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                      <span className="text-xs text-slate-400 ml-2">{item.aciklama}</span>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{formatMaas(item.value)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${item.color} transition-all`}
                      style={{ width: `${item.yuzde}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-slate-100 flex justify-between text-sm">
              <div className="text-center">
                <div className="font-bold text-slate-900">{formatMaas(sonuc.ortalama)}</div>
                <div className="text-slate-400 text-xs">Ortalama</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-900">{formatMaas(sonuc.p50)}</div>
                <div className="text-slate-400 text-xs">Medyan</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-900">{sonuc.adet}</div>
                <div className="text-slate-400 text-xs">Kayıt</div>
              </div>
            </div>
          </div>

          {/* Yorum */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
            💡 <strong>Ne anlama geliyor?</strong> Eğer şu an P50&apos;nin altında maaş alıyorsan, müzakere için güçlü bir gerekçen var. P75 ve üzeri maaş alıyorsan piyasa değerinin üstündesin.
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-3">Veriyi zenginleştirmek için sen de paylaş</p>
            <Link
              href="/maas-ekle"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm inline-block"
            >
              Maaşını Anonim Paylaş
            </Link>
          </div>
        </div>
      )}

      {sonuc && sonuc.yetersiz && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-semibold text-slate-700 mb-2">Yeterli veri yok</h3>
          <p className="text-slate-400 text-sm mb-5">
            Bu kriterlere uyan {sonuc.adet} kayıt var. Güvenilir sonuç için en az 3 kayıt gerekiyor.
            Filtreni genişlet veya ilk veriyi sen ekle.
          </p>
          <Link href="/maas-ekle" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
            Veri Ekle
          </Link>
        </div>
      )}

      {!params.sektor && (
        <div className="text-center text-slate-400 text-sm py-8">
          Yukarıdaki formu doldurarak başla ↑
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR").format(Math.round(n)) + " ₺";
}

const EGITIM_TIPLERI = [
  { id: "yuksek_lisans", label: "Yüksek Lisans (Tam Zamanlı)", sure: 2, maliyet: 150_000, maasArtis: 0.20, firsat: true },
  { id: "yuksek_lisans_parca", label: "Yüksek Lisans (Yarı Zamanlı / Online)", sure: 3, maliyet: 80_000, maasArtis: 0.18, firsat: false },
  { id: "mba", label: "MBA (Türkiye)", sure: 2, maliyet: 250_000, maasArtis: 0.30, firsat: true },
  { id: "sertifika", label: "Profesyonel Sertifika (AWS, PMP vb.)", sure: 0.25, maliyet: 15_000, maasArtis: 0.10, firsat: false },
  { id: "bootcamp", label: "Yazılım Bootcamp", sure: 0.5, maliyet: 50_000, maasArtis: 0.35, firsat: false },
  { id: "doktora", label: "Doktora", sure: 4, maliyet: 80_000, maasArtis: 0.25, firsat: true },
];

export default function EgitimROIPage() {
  const [mevcutMaas, setMevcutMaas] = useState("");
  const [seciliEgitim, setSeciliEgitim] = useState(EGITIM_TIPLERI[0].id);
  const [ozelMaliyet, setOzelMaliyet] = useState("");
  const [ozelArtis, setOzelArtis] = useState("");

  const maas = parseFloat(mevcutMaas.replace(/\./g, "").replace(",", ".")) || 0;
  const egitim = EGITIM_TIPLERI.find((e) => e.id === seciliEgitim)!;
  const maliyet = parseFloat(ozelMaliyet) || egitim.maliyet;
  const artisOrani = parseFloat(ozelArtis) / 100 || egitim.maasArtis;

  const yeniMaas = maas * (1 + artisOrani);
  const aylikArtis = yeniMaas - maas;
  const yillikArtis = aylikArtis * 12;

  // Fırsat maliyeti: eğitim süresince kazanılamayan maaş
  const firsatMaliyeti = egitim.firsat ? maas * 12 * egitim.sure : 0;
  const toplamMaliyet = maliyet + firsatMaliyeti;

  // Geri ödeme süresi (ay)
  const geriOdemeSuresi = aylikArtis > 0 ? toplamMaliyet / aylikArtis : null;
  const geriOdemeYil = (geri: number) => Math.floor(geri / 12);
  const geriOdemeAy = (geri: number) => Math.round(geri % 12);

  // 5 yıllık toplam kazanım
  const esikYil = egitim.sure;
  const kazanim5Yil = aylikArtis * 12 * (5 - esikYil) - toplamMaliyet;
  const kazanim10Yil = aylikArtis * 12 * (10 - esikYil) - toplamMaliyet;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Eğitim Yatırım Getirisi (ROI)</h1>
        <p className="text-slate-500 text-sm">MBA, yüksek lisans veya sertifika almak kaç yılda kendini amorti eder?</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mevcut aylık brüt maaşın (₺)</label>
            <input
              type="text"
              value={mevcutMaas}
              onChange={(e) => setMevcutMaas(e.target.value)}
              placeholder="Örn: 50000"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Eğitim türü</label>
            <div className="space-y-2">
              {EGITIM_TIPLERI.map((e) => (
                <label key={e.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${seciliEgitim === e.id ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-200"}`}>
                  <input type="radio" name="egitim" value={e.id} checked={seciliEgitim === e.id} onChange={() => setSeciliEgitim(e.id)} className="mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{e.label}</p>
                    <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
                      <span>{e.sure < 1 ? `${e.sure * 12} ay` : `${e.sure} yıl`}</span>
                      <span>{fmt(e.maliyet)} maliyet</span>
                      <span className="text-emerald-600">~%{Math.round(e.maasArtis * 100)} maaş artışı</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Özel maliyet (₺, opsiyonel)</label>
              <input type="number" value={ozelMaliyet} onChange={(e) => setOzelMaliyet(e.target.value)} placeholder={String(egitim.maliyet)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Özel maaş artışı (%)</label>
              <input type="number" value={ozelArtis} onChange={(e) => setOzelArtis(e.target.value)} placeholder={String(Math.round(egitim.maasArtis * 100))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {maas > 0 && (
        <>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-4">
            <p className="text-blue-200 text-sm mb-1">Eğitimden sonra tahmini maaş</p>
            <p className="text-3xl font-bold">{fmt(yeniMaas)}<span className="text-xl">/ay</span></p>
            <p className="text-blue-200 text-sm mt-1">Aylık +{fmt(aylikArtis)} · Yıllık +{fmt(yillikArtis)}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-4">
            <h2 className="font-bold text-slate-900 mb-4">Maliyet Analizi</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Eğitim maliyeti</span>
                <span className="font-semibold text-slate-900">- {fmt(maliyet)}</span>
              </div>
              {firsatMaliyeti > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Fırsat maliyeti ({egitim.sure} yıl tam zamanlı)</span>
                  <span className="font-semibold text-slate-900">- {fmt(firsatMaliyeti)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-900">Toplam yatırım</span>
                <span className="font-bold text-red-600">- {fmt(toplamMaliyet)}</span>
              </div>

              {geriOdemeSuresi && (
                <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="font-semibold text-emerald-900">Geri ödeme süresi</p>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">
                    {geriOdemeYil(geriOdemeSuresi) > 0 && `${geriOdemeYil(geriOdemeSuresi)} yıl `}
                    {geriOdemeAy(geriOdemeSuresi) > 0 && `${geriOdemeAy(geriOdemeSuresi)} ay`}
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5">eğitim tamamlandıktan sonra</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4">Uzun Vadeli Kazanım</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { yil: 5, deger: kazanim5Yil },
                { yil: 10, deger: kazanim10Yil },
              ].map(({ yil, deger }) => (
                <div key={yil} className={`rounded-xl p-4 text-center ${deger > 0 ? "bg-emerald-50" : "bg-red-50"}`}>
                  <p className="text-xs font-semibold text-slate-500 mb-1">{yil} yıl sonra net kazanım</p>
                  <p className={`text-lg font-bold ${deger > 0 ? "text-emerald-700" : "text-red-600"}`}>{deger > 0 ? "+" : ""}{fmt(deger)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">(toplam yatırım düşüldükten sonra)</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center mt-4">
            * Hesaplamalar tahmini olup enflasyon, sektör farkı ve bireysel faktörler hesaba katılmamıştır.
          </p>
        </>
      )}
    </div>
  );
}

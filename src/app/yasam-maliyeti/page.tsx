"use client";

import { useState } from "react";

// Türkiye şehirleri tahmini yaşam maliyeti endeksi (2025)
// Kaynak: TÜİK verileri + piyasa araştırması
const SEHIRLER: Record<string, {
  kira1p: number; kira2p: number; ulasim: number; yemek: number;
  market: number; dogalgaz: number; yasam_indeksi: number;
}> = {
  "İstanbul": { kira1p: 18000, kira2p: 28000, ulasim: 1000, yemek: 5000, market: 8000, dogalgaz: 1500, yasam_indeksi: 100 },
  "Ankara": { kira1p: 12000, kira2p: 18000, ulasim: 800, yemek: 4000, market: 7000, dogalgaz: 1800, yasam_indeksi: 78 },
  "İzmir": { kira1p: 13000, kira2p: 20000, ulasim: 900, yemek: 4500, market: 7500, dogalgaz: 1200, yasam_indeksi: 83 },
  "Bursa": { kira1p: 9000, kira2p: 14000, ulasim: 700, yemek: 3500, market: 6500, dogalgaz: 1600, yasam_indeksi: 68 },
  "Antalya": { kira1p: 11000, kira2p: 17000, ulasim: 700, yemek: 4000, market: 7000, dogalgaz: 800, yasam_indeksi: 75 },
  "Adana": { kira1p: 7000, kira2p: 11000, ulasim: 600, yemek: 3000, market: 6000, dogalgaz: 1400, yasam_indeksi: 60 },
  "Konya": { kira1p: 6500, kira2p: 10000, ulasim: 600, yemek: 2800, market: 5500, dogalgaz: 1700, yasam_indeksi: 57 },
  "Gaziantep": { kira1p: 6000, kira2p: 9500, ulasim: 550, yemek: 2800, market: 5500, dogalgaz: 1500, yasam_indeksi: 55 },
  "Kayseri": { kira1p: 5500, kira2p: 8500, ulasim: 550, yemek: 2700, market: 5000, dogalgaz: 1800, yasam_indeksi: 52 },
  "Eskişehir": { kira1p: 6000, kira2p: 9000, ulasim: 600, yemek: 3000, market: 5500, dogalgaz: 1700, yasam_indeksi: 55 },
  "Trabzon": { kira1p: 5000, kira2p: 7500, ulasim: 500, yemek: 2500, market: 5000, dogalgaz: 1500, yasam_indeksi: 49 },
  "Mersin": { kira1p: 6500, kira2p: 10000, ulasim: 600, yemek: 3000, market: 6000, dogalgaz: 900, yasam_indeksi: 57 },
};

const SEHIR_LISTESI = Object.keys(SEHIRLER);

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR").format(Math.round(n)) + " ₺";
}

function toplamMaliyet(sehir: string, tip: "1p" | "2p"): number {
  const s = SEHIRLER[sehir];
  const kira = tip === "1p" ? s.kira1p : s.kira2p;
  return kira + s.ulasim + s.yemek + s.market + s.dogalgaz;
}

export default function YasamMaliyetiPage() {
  const [sehir1, setSehir1] = useState("İstanbul");
  const [sehir2, setSehir2] = useState("Ankara");
  const [maas1, setMaas1] = useState("");
  const [tip, setTip] = useState<"1p" | "2p">("1p");

  const maasNum = parseFloat(maas1.replace(/\./g, "").replace(",", ".")) || 0;
  const maliyet1 = toplamMaliyet(sehir1, tip);
  const maliyet2 = toplamMaliyet(sehir2, tip);
  const fark = Math.abs(maliyet1 - maliyet2);

  // Eğer Şehir 1'de X maaş alıyorsa, Şehir 2'de kaç almalı?
  const esdeğer = maasNum > 0 ? maasNum * (maliyet2 / maliyet1) : 0;
  // Tasarruf oranı
  const tasarruf1 = maasNum > 0 ? maasNum - maliyet1 : 0;
  const tasarruf2 = esdeğer > 0 ? esdeğer - maliyet2 : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Şehir Yaşam Maliyeti Karşılaştırması</h1>
        <p className="text-slate-500 text-sm">
          Aynı maaşla farklı şehirlerde ne kadar rahat yaşarsın? Gerçek alım gücünü keşfet.
        </p>
      </div>

      {/* Hane tipi */}
      <div className="flex gap-2 mb-5">
        {(["1p", "2p"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTip(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tip === t ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
            }`}
          >
            {t === "1p" ? "👤 Tek kişi" : "👥 Çift / 2 kişi"}
          </button>
        ))}
      </div>

      {/* Şehir seçimi */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {([["Şehir 1", sehir1, setSehir1, "blue"] as const, ["Şehir 2", sehir2, setSehir2, "purple"] as const]).map(([label, val, setVal, renk]) => (
          <div key={label}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            <select
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className={`w-full border-2 ${renk === "blue" ? "border-blue-400" : "border-purple-400"} rounded-xl px-3 py-2.5 text-sm font-semibold bg-white focus:outline-none`}
            >
              {SEHIR_LISTESI.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Maaş girişi (opsiyonel) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {sehir1}&apos;daki maaşın (opsiyonel — eşdeğer hesaplama için)
        </label>
        <input
          type="text"
          value={maas1}
          onChange={(e) => setMaas1(e.target.value)}
          placeholder="Örn: 50000"
          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Karşılaştırma kartları */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {[
          { sehir: sehir1, renk: "blue", etiket: "Şehir 1" },
          { sehir: sehir2, renk: "purple", etiket: "Şehir 2" },
        ].map(({ sehir, renk, etiket }) => {
          const s = SEHIRLER[sehir];
          const top = toplamMaliyet(sehir, tip);
          return (
            <div key={sehir} className={`bg-white rounded-2xl border-2 ${renk === "blue" ? "border-blue-200" : "border-purple-200"} p-5 shadow-sm`}>
              <div className={`text-xs font-semibold ${renk === "blue" ? "text-blue-600" : "text-purple-600"} mb-1`}>{etiket}</div>
              <h2 className="font-bold text-slate-900 text-lg mb-3">{sehir}</h2>
              <div className="space-y-2 text-sm">
                {[
                  { label: "🏠 Kira", value: tip === "1p" ? s.kira1p : s.kira2p },
                  { label: "🚌 Ulaşım", value: s.ulasim },
                  { label: "🍽️ Dışarıda yemek", value: s.yemek },
                  { label: "🛒 Market", value: s.market },
                  { label: "🔥 Doğalgaz/Elektrik", value: s.dogalgaz },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-medium text-slate-800">{fmt(item.value)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold">
                  <span className="text-slate-700">Toplam</span>
                  <span className={renk === "blue" ? "text-blue-700" : "text-purple-700"}>{fmt(top)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sonuç */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-5">
        <h2 className="font-bold text-slate-900 mb-4">Analiz</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Aylık maliyet farkı ({sehir1} - {sehir2})</span>
            <span className={`font-bold ${maliyet1 > maliyet2 ? "text-red-600" : "text-emerald-600"}`}>
              {maliyet1 > maliyet2 ? "+" : "-"}{fmt(fark)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Yıllık maliyet farkı</span>
            <span className={`font-bold ${maliyet1 > maliyet2 ? "text-red-600" : "text-emerald-600"}`}>
              {maliyet1 > maliyet2 ? "+" : "-"}{fmt(fark * 12)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Yaşam maliyeti endeksi ({sehir1} = 100)</span>
            <span className="font-bold text-slate-900">
              {sehir1}: 100 · {sehir2}: {Math.round((SEHIRLER[sehir2].yasam_indeksi / SEHIRLER[sehir1].yasam_indeksi) * 100)}
            </span>
          </div>

          {maasNum > 0 && (
            <>
              <div className="pt-3 border-t border-slate-100">
                <p className="font-semibold text-slate-800 mb-2">Alım gücü analizi</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { sehir: sehir1, maas: maasNum, maliyet: maliyet1, renk: "blue" },
                    { sehir: sehir2, maas: esdeğer, maliyet: maliyet2, renk: "purple" },
                  ].map(({ sehir, maas, maliyet, renk }) => {
                    const tasarruf = maas - maliyet;
                    return (
                      <div key={sehir} className={`bg-${renk}-50 rounded-xl p-3`}>
                        <p className={`text-xs font-semibold text-${renk}-700 mb-1`}>{sehir}</p>
                        <p className="text-sm text-slate-600">Maaş: <span className="font-bold text-slate-900">{fmt(maas)}</span></p>
                        <p className="text-sm text-slate-600">Gider: <span className="font-bold">{fmt(maliyet)}</span></p>
                        <p className={`text-sm font-bold mt-1 ${tasarruf >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {tasarruf >= 0 ? "Tasarruf: " : "Açık: "}{fmt(Math.abs(tasarruf))}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">{sehir1}&apos;da {fmt(maasNum)} alan biri, {sehir2}&apos;da </span>
                    <span className="font-bold text-amber-900">{fmt(esdeğer)}</span>
                    <span className="font-semibold"> alarak aynı yaşam standardını sürdürebilir.</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        * Veriler tahmini ortalama değerlerdir. Mahalle, hane büyüklüğü ve yaşam tarzına göre önemli farklılıklar olabilir.
      </p>
    </div>
  );
}

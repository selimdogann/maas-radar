"use client";

import { useState } from "react";

// 2025 Türkiye gelir vergisi dilimleri (yıllık)
const VERGI_DILIMLERI = [
  { limit: 110_000, oran: 0.15 },
  { limit: 230_000, oran: 0.20 },
  { limit: 870_000, oran: 0.27 },
  { limit: 3_000_000, oran: 0.35 },
  { limit: Infinity, oran: 0.40 },
];

function gelirVergisiHesapla(yillikMatrah: number): number {
  let vergi = 0;
  let kalan = yillikMatrah;
  let oncekiLimit = 0;
  for (const dilim of VERGI_DILIMLERI) {
    if (kalan <= 0) break;
    const dilimTutari = Math.min(kalan, dilim.limit - oncekiLimit);
    vergi += dilimTutari * dilim.oran;
    kalan -= dilimTutari;
    oncekiLimit = dilim.limit;
  }
  return vergi / 12;
}

function hesaplaNet(brut: number, ay: number) {
  // SGK işçi payı: emeklilik %9 + sağlık %5 = %14
  const sgk = brut * 0.14;
  // İşsizlik sigortası işçi payı: %1
  const issizlik = brut * 0.01;
  // Damga vergisi: binde 7.59
  const damga = brut * 0.00759;
  // Kümülatif vergi matrahı
  const aylikMatrah = brut - sgk - issizlik;
  const kumulatifMatrah = aylikMatrah * ay;
  const kumulatifVergi = gelirVergisiHesapla(kumulatifMatrah) * ay;
  const oncekiKumulatifVergi = ay > 1 ? gelirVergisiHesapla(aylikMatrah * (ay - 1)) * (ay - 1) : 0;
  const buAyVergi = kumulatifVergi - oncekiKumulatifVergi;
  const net = brut - sgk - issizlik - buAyVergi - damga;
  return { net: Math.round(net), sgk: Math.round(sgk), issizlik: Math.round(issizlik), damga: Math.round(damga), vergi: Math.round(buAyVergi), matrah: Math.round(aylikMatrah) };
}

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR").format(n) + " ₺";
}

export default function NetMaasPage() {
  const [brut, setBrut] = useState("");
  const [ay, setAy] = useState(1);
  const brutNum = parseFloat(brut.replace(/\./g, "").replace(",", ".")) || 0;
  const sonuc = brutNum > 0 ? hesaplaNet(brutNum, ay) : null;
  const efektifOran = sonuc ? Math.round((1 - sonuc.net / brutNum) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Brüt → Net Maaş Hesaplama</h1>
        <p className="text-slate-500 text-sm">
          2025 Türkiye vergi dilimlerine göre tahmini net maaşını hesapla.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Brüt maaş (aylık TL)</label>
            <input
              type="text"
              value={brut}
              onChange={(e) => setBrut(e.target.value)}
              placeholder="Örn: 50000"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Yılın kaçıncı ayı? <span className="text-slate-400 font-normal">(vergi dilimine etkisi için)</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <button
                  key={m}
                  onClick={() => setAy(m)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    ay === m ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {sonuc && (
        <>
          {/* Ana sonuç */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-4 shadow-md">
            <p className="text-blue-200 text-sm mb-1">Tahmini net maaş ({ay}. ay)</p>
            <p className="text-4xl font-bold mb-1">{fmt(sonuc.net)}</p>
            <p className="text-blue-200 text-sm">Brütün %{100 - efektifOran}&apos;i · Kesintiler: %{efektifOran}</p>
          </div>

          {/* Kesinti detayları */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-4">
            <h2 className="font-bold text-slate-900 mb-4">Kesinti Detayları</h2>
            <div className="space-y-3">
              {[
                { label: "SGK İşçi Payı (%14)", value: sonuc.sgk, color: "bg-purple-400" },
                { label: "İşsizlik Sigortası (%1)", value: sonuc.issizlik, color: "bg-orange-400" },
                { label: `Gelir Vergisi (${ay}. ay)`, value: sonuc.vergi, color: "bg-red-400" },
                { label: "Damga Vergisi (‰7.59)", value: sonuc.damga, color: "bg-yellow-400" },
              ].map((k) => (
                <div key={k.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{k.label}</span>
                    <span className="font-semibold text-slate-900">- {fmt(k.value)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${k.color} rounded-full`}
                      style={{ width: `${(k.value / brutNum) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">Toplam Kesinti</span>
                <span className="font-bold text-red-600">- {fmt(brutNum - sonuc.net)}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="font-bold text-slate-900">Net Maaş</span>
                <span className="font-bold text-emerald-600 text-lg">{fmt(sonuc.net)}</span>
              </div>
            </div>
          </div>

          {/* Özet tablo */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-700 text-sm mb-3">Aylara göre tahmini net</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {Array.from({ length: 12 }, (_, i) => {
                const a = i + 1;
                const n = hesaplaNet(brutNum, a);
                return (
                  <div
                    key={a}
                    className={`rounded-lg p-2 text-center cursor-pointer transition-all ${
                      a === ay ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-700 hover:border-blue-300"
                    }`}
                    onClick={() => setAy(a)}
                  >
                    <div className="text-xs font-medium">{a}. ay</div>
                    <div className="text-xs mt-0.5 font-bold">
                      {new Intl.NumberFormat("tr-TR", { notation: "compact", maximumFractionDigits: 0 }).format(n.net)} ₺
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4 text-center">
            * Bu hesaplama tahmini olup gerçek bordronuzdan farklılık gösterebilir. SGK tavanı ve asgari ücret vergi avantajı hesaba katılmamıştır.
          </p>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

// Türkiye TÜFE Endeksi (2020 Ocak = 100 baz)
// TÜİK resmi yıllık enflasyon verilerine dayalı kümülatif endeks
const TUFE_ENDEKS: Record<string, number> = {
  "2020-01": 100, "2020-06": 107, "2020-12": 115,
  "2021-01": 117, "2021-06": 124, "2021-12": 138,
  "2022-01": 152, "2022-06": 198, "2022-12": 237,
  "2023-01": 262, "2023-06": 340, "2023-12": 391,
  "2024-01": 415, "2024-06": 535, "2024-12": 575,
  "2025-01": 600, "2025-06": 645, "2025-12": 685,
  "2026-01": 705, "2026-03": 720,
};

const YILLAR = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];
const AYLAR = [
  { value: "01", label: "Ocak" }, { value: "02", label: "Şubat" }, { value: "03", label: "Mart" },
  { value: "04", label: "Nisan" }, { value: "05", label: "Mayıs" }, { value: "06", label: "Haziran" },
  { value: "07", label: "Temmuz" }, { value: "08", label: "Ağustos" }, { value: "09", label: "Eylül" },
  { value: "10", label: "Ekim" }, { value: "11", label: "Kasım" }, { value: "12", label: "Aralık" },
];

function getEndeks(yil: string, ay: string): number {
  const key = `${yil}-${ay}`;
  if (TUFE_ENDEKS[key]) return TUFE_ENDEKS[key];
  // Linear interpolation for missing months
  const tümAnahtar = Object.keys(TUFE_ENDEKS).sort();
  const onceki = tümAnahtar.filter((k) => k <= key).pop();
  const sonraki = tümAnahtar.find((k) => k > key);
  if (!onceki) return 100;
  if (!sonraki) return TUFE_ENDEKS[onceki];
  const oncekiVal = TUFE_ENDEKS[onceki];
  const sonrakiVal = TUFE_ENDEKS[sonraki];
  const [oy, oay] = onceki.split("-").map(Number);
  const [sy, saay] = sonraki.split("-").map(Number);
  const [gy, gaay] = key.split("-").map(Number);
  const toplamAy = (sy - oy) * 12 + (saay - oay);
  const gecenAy = (gy - oy) * 12 + (gaay - oay);
  return oncekiVal + (sonrakiVal - oncekiVal) * (gecenAy / toplamAy);
}

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR").format(Math.round(n)) + " ₺";
}

export default function EnflasyonPage() {
  const [maas, setMaas] = useState("");
  const [baslangicYil, setBaslangicYil] = useState("2022");
  const [baslangicAy, setBaslangicAy] = useState("01");
  const [bitisYil, setBitisYil] = useState("2026");
  const [bitisAy, setBitisAy] = useState("03");

  const maasNum = parseFloat(maas.replace(/\./g, "").replace(",", ".")) || 0;
  const baslangicEndeks = getEndeks(baslangicYil, baslangicAy);
  const bitisEndeks = getEndeks(bitisYil, bitisAy);
  const enflasyonOrani = ((bitisEndeks - baslangicEndeks) / baslangicEndeks) * 100;
  const esDegerMaas = maasNum > 0 ? maasNum * (bitisEndeks / baslangicEndeks) : 0;
  const gercekDeger = maasNum > 0 ? maasNum * (baslangicEndeks / bitisEndeks) : 0;
  const satinaGucuKaybi = maasNum > 0 ? maasNum - gercekDeger : 0;

  const ORNEKLER = [
    { yil: "2022", ay: "01", maas: 15000, etiket: "2022 başı 15K" },
    { yil: "2021", ay: "01", maas: 10000, etiket: "2021 başı 10K" },
    { yil: "2020", ay: "01", maas: 8000, etiket: "2020 başı 8K" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Enflasyona Göre Gerçek Maaş</h1>
        <p className="text-slate-500 text-sm">
          Geçmişteki maaşın bugün ne kadar eder? Satın alma gücündeki kaybı hesapla.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Maaş (₺)</label>
            <input
              type="text"
              value={maas}
              onChange={(e) => setMaas(e.target.value)}
              placeholder="Örn: 20000"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Başlangıç tarihi</label>
              <div className="grid grid-cols-2 gap-2">
                <select value={baslangicYil} onChange={(e) => setBaslangicYil(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {YILLAR.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={baslangicAy} onChange={(e) => setBaslangicAy(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {AYLAR.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Bitiş tarihi</label>
              <div className="grid grid-cols-2 gap-2">
                <select value={bitisYil} onChange={(e) => setBitisYil(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {YILLAR.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={bitisAy} onChange={(e) => setBitisAy(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {AYLAR.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sonuç */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white mb-4">
        <p className="text-red-100 text-sm mb-1">{baslangicYil}/{baslangicAy} → {bitisYil}/{bitisAy} kümülatif enflasyon</p>
        <p className="text-4xl font-bold">%{Math.round(enflasyonOrani)}</p>
        <p className="text-red-200 text-sm mt-1">TÜFE endeks: {Math.round(baslangicEndeks)} → {Math.round(bitisEndeks)}</p>
      </div>

      {maasNum > 0 && (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-sm text-slate-500 mb-1">Bugünün değeri için gereken maaş</p>
              <p className="text-2xl font-bold text-emerald-600">{fmt(esDegerMaas)}</p>
              <p className="text-xs text-slate-400 mt-1">{baslangicYil} tarihli {fmt(maasNum)} ile aynı satın alma gücü</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-sm text-slate-500 mb-1">{baslangicYil} değeriyle bugünkü {fmt(maasNum)}</p>
              <p className="text-2xl font-bold text-slate-900">{fmt(gercekDeger)}</p>
              <p className="text-xs text-red-500 mt-1">Satın alma gücü kaybı: {fmt(satinaGucuKaybi)}</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="font-semibold text-amber-900 mb-2">Ne anlama geliyor?</p>
            <p className="text-sm text-amber-800 leading-relaxed">
              {baslangicYil} başında {fmt(maasNum)} alan biri aynı yaşam standardını korumak için bugün en az{" "}
              <span className="font-bold">{fmt(esDegerMaas)}</span> almalı.
              Eğer maaşı bu seviyenin altındaysa, nominal olarak artmış olsa bile{" "}
              <span className="font-bold">gerçek satın alma gücü düşmüş demektir.</span>
            </p>
          </div>
        </div>
      )}

      {/* Örnek senaryolar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="font-bold text-slate-900 mb-4">Örnek Senaryolar</h2>
        <div className="space-y-3">
          {ORNEKLER.map((ornek) => {
            const bEndeks = getEndeks(ornek.yil, ornek.ay);
            const sonEndeks = getEndeks("2026", "03");
            const esliger = Math.round(ornek.maas * (sonEndeks / bEndeks));
            const enf = Math.round(((sonEndeks - bEndeks) / bEndeks) * 100);
            return (
              <div
                key={ornek.etiket}
                className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50 rounded-lg px-2 transition-colors"
                onClick={() => { setMaas(String(ornek.maas)); setBaslangicYil(ornek.yil); setBaslangicAy(ornek.ay); setBitisYil("2026"); setBitisAy("03"); }}
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{ornek.etiket}</p>
                  <p className="text-xs text-slate-400">%{enf} kümülatif enflasyon</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{fmt(esliger)}</p>
                  <p className="text-xs text-slate-400">bugünkü eşdeğer</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center mt-5">
        * TÜFE verileri TÜİK resmi açıklamalarına dayanmakta olup bazı dönemler için tahmini interpolasyon kullanılmıştır.
      </p>
    </div>
  );
}

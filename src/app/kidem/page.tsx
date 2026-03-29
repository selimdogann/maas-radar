"use client";

import { useState } from "react";

// 2025 yılı kıdem tazminatı tavanı (her yıl güncellenir)
const KIDEM_TAVANI_AYLIK = 47551.38; // 2025 H1 tahmini

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n) + " ₺";
}

export default function KidemPage() {
  const [bruMaas, setBrutMaas] = useState("");
  const [yil, setYil] = useState("");
  const [ay, setAy] = useState("");
  const [gun, setGun] = useState("");
  const [ihbarSuresi, setIhbarSuresi] = useState("8");

  const brut = parseFloat(bruMaas.replace(/\./g, "").replace(",", ".")) || 0;
  const calismaSure = (parseFloat(yil) || 0) + (parseFloat(ay) || 0) / 12 + (parseFloat(gun) || 0) / 365;
  const ihbarHafta = parseInt(ihbarSuresi) || 0;

  // Kıdem tazminatı hesabı
  // Giydirilmiş brüt: yemek, ulaşım vb. dahil (sadece brüt maaş alıyoruz, giydirilmiş = brüt)
  const bazMaas = Math.min(brut, KIDEM_TAVANI_AYLIK);
  const kidemTazminat = bazMaas * calismaSure;

  // İhbar tazminatı
  const ihbarTazminat = brut * (ihbarHafta / 4.33);

  // Kullanılmayan izin tazminatı (örnek: 14 gün)
  const izinGun = 14;
  const izinTazminat = brut / 30 * izinGun;

  const toplamMin = kidemTazminat;
  const toplamMax = kidemTazminat + ihbarTazminat + izinTazminat;

  const IHBAR_SURELER = [
    { label: "0–6 ay → 2 hafta", yil_min: 0, yil_max: 0.5, hafta: 2 },
    { label: "6 ay–1.5 yıl → 4 hafta", yil_min: 0.5, yil_max: 1.5, hafta: 4 },
    { label: "1.5–3 yıl → 6 hafta", yil_min: 1.5, yil_max: 3, hafta: 6 },
    { label: "3+ yıl → 8 hafta", yil_min: 3, yil_max: Infinity, hafta: 8 },
  ];

  const onerilen = IHBAR_SURELER.find(
    (s) => calismaSure >= s.yil_min && calismaSure < s.yil_max
  );

  const kosullar = [
    { label: "Kıdem tazminatı alabilir misin?", kontrol: calismaSure >= 1, evet: "Evet — 1 yılı doldurdun", hayir: "Hayır — en az 1 yıl çalışman gerekiyor" },
    { label: "İşveren haklı nedensiz çıkarmış mı?", kontrol: null, evet: "İşveren haklı nedenle çıkartırsa (4857 m.25/II) tazminat yok", hayir: "" },
    { label: "Kendin istifa ettin mi?", kontrol: null, evet: "Zorunlu nedenler dışında istifa → tazminat yok", hayir: "" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Kıdem & İhbar Tazminatı Hesaplama</h1>
        <p className="text-slate-500 text-sm">
          İşten ayrılırken ne kadar alacağını hesapla. 2025 tazminat tavanına göre.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Brüt maaş (aylık ₺)</label>
            <input
              type="text"
              value={bruMaas}
              onChange={(e) => setBrutMaas(e.target.value)}
              placeholder="Örn: 50000"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Toplam çalışma süresi</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  type="number"
                  value={yil}
                  onChange={(e) => setYil(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-400 text-center mt-1">Yıl</p>
              </div>
              <div>
                <input
                  type="number"
                  value={ay}
                  onChange={(e) => setAy(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="11"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-400 text-center mt-1">Ay</p>
              </div>
              <div>
                <input
                  type="number"
                  value={gun}
                  onChange={(e) => setGun(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="30"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-400 text-center mt-1">Gün</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              İhbar süresi{" "}
              {onerilen && <span className="text-blue-600 font-normal text-xs">(Kanuni: {onerilen.hafta} hafta)</span>}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 6, 8].map((h) => (
                <button
                  key={h}
                  onClick={() => setIhbarSuresi(String(h))}
                  className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                    parseInt(ihbarSuresi) === h ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {h} hafta
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {brut > 0 && calismaSure > 0 && (
        <>
          {/* Sonuçlar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className={`rounded-2xl p-5 ${calismaSure >= 1 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"}`}>
              <p className={`text-sm mb-1 ${calismaSure >= 1 ? "text-emerald-100" : ""}`}>Kıdem Tazminatı</p>
              <p className="text-2xl font-bold">{calismaSure >= 1 ? fmt(kidemTazminat) : "Hak kazanılmadı"}</p>
              {calismaSure >= 1 && brut > KIDEM_TAVANI_AYLIK && (
                <p className="text-xs text-emerald-200 mt-1">Tavan uygulandı: {fmt(KIDEM_TAVANI_AYLIK)}/ay</p>
              )}
            </div>
            <div className="bg-blue-600 text-white rounded-2xl p-5">
              <p className="text-blue-100 text-sm mb-1">İhbar Tazminatı</p>
              <p className="text-2xl font-bold">{fmt(ihbarTazminat)}</p>
              <p className="text-xs text-blue-200 mt-1">{ihbarSuresi} hafta × {fmt(brut / 4.33)}/hafta</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-5">
            <h2 className="font-bold text-slate-900 mb-4">Detaylı Hesap</h2>
            <div className="space-y-3">
              {[
                { label: "Kıdem tazminatı", value: calismaSure >= 1 ? kidemTazminat : 0, aciklama: `${calismaSure.toFixed(2)} yıl × ${fmt(bazMaas)}` },
                { label: "İhbar tazminatı", value: ihbarTazminat, aciklama: `${ihbarSuresi} hafta ihbar` },
                { label: "Kullanılmamış izin (14 gün varsayım)", value: izinTazminat, aciklama: `${fmt(brut)}/30 × ${izinGun}` },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.aciklama}</p>
                  </div>
                  <span className="font-bold text-slate-900 text-sm">{fmt(item.value)}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Minimum (sadece kıdem)</span>
                  <span className="font-bold text-emerald-600">{fmt(toplamMin)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold text-slate-900">Maksimum (kıdem + ihbar + izin)</span>
                  <span className="font-bold text-blue-600">{fmt(toplamMax)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hak koşulları */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
            <h3 className="font-semibold text-amber-900 mb-3">Tazminat Hakkı Koşulları</h3>
            <div className="space-y-2">
              <div className={`flex gap-2 text-sm ${calismaSure >= 1 ? "text-emerald-700" : "text-red-700"}`}>
                <span>{calismaSure >= 1 ? "✓" : "✗"}</span>
                <span>1 yıl çalışma şartı: {calismaSure >= 1 ? `${calismaSure.toFixed(1)} yıl — hak kazandın` : `${calismaSure.toFixed(1)} yıl — henüz hak yok`}</span>
              </div>
              {[
                "İşveren haklı nedenle (4857 m.25/II) çıkartırsa tazminat ödenmez.",
                "Kendin istifa edersen tazminat almak için zorunlu nedenler gerekir (askerlik, evlilik, emeklilik vb.)",
                "Deneme süresinde ayrılmada kıdem tazminatı yoktur.",
                "İhbar tazminatı işveren veya çalışan tarafından talep edilebilir.",
              ].map((m, i) => (
                <div key={i} className="flex gap-2 text-sm text-amber-800">
                  <span className="shrink-0">ℹ</span>
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500">
        <p className="font-semibold mb-1">2025 Kıdem Tazminatı Tavanı: {fmt(KIDEM_TAVANI_AYLIK)}</p>
        <p>Bu hesaplama yalnızca brüt maaş üzerinden yapılmaktadır. Fiilen ödenen giydirilmiş ücret (yemek, ulaşım, prim vb.) dahil edildiğinde tutar farklılaşabilir. Kesin hukuki danışmanlık için avukat görüşü alın.</p>
      </div>
    </div>
  );
}

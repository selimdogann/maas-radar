"use client";

import { useState } from "react";

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR").format(Math.round(n));
}

interface Teklif {
  sirket: string;
  pozisyon: string;
  maasAylik: string;
  bonusYillik: string;
  hisseYillik: string;
  ulaşım: string;
  yemek: string;
  remote: string; // "tam", "hibrit", "ofis"
  izinGun: string;
  sigorta: string; // "evet" / "hayır"
  egitimButcesi: string;
}

const BOSH: Teklif = {
  sirket: "", pozisyon: "", maasAylik: "", bonusYillik: "",
  hisseYillik: "", ulaşım: "", yemek: "", remote: "ofis",
  izinGun: "14", sigorta: "hayır", egitimButcesi: "",
};

function toplamYillik(t: Teklif): number {
  const maas = parseFloat(t.maasAylik) || 0;
  const bonus = parseFloat(t.bonusYillik) || 0;
  const hisse = parseFloat(t.hisseYillik) || 0;
  const ulasim = (parseFloat(t.ulaşım) || 0) * 12;
  const yemek = (parseFloat(t.yemek) || 0) * 22 * 12; // günlük * iş günü * 12 ay
  const sigorta = t.sigorta === "evet" ? 6000 : 0; // yıllık 6K TL sigorta değeri
  const egitim = parseFloat(t.egitimButcesi) || 0;
  const remotePrim = t.remote === "tam" ? maas * 12 * 0.05 : t.remote === "hibrit" ? maas * 12 * 0.02 : 0;
  const izinPrim = ((parseFloat(t.izinGun) || 14) - 14) * (maas / 22);
  return maas * 12 + bonus + hisse + ulasim + yemek + sigorta + egitim + remotePrim + izinPrim;
}

function Alan({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

const INPUT_CLS = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
const SELECT_CLS = INPUT_CLS;

export default function TeklifPage() {
  const [a, setA] = useState<Teklif>({ ...BOSH });
  const [b, setB] = useState<Teklif>({ ...BOSH });

  const topA = toplamYillik(a);
  const topB = toplamYillik(b);
  const fark = Math.abs(topA - topB);
  const kazanan = topA > topB ? "A" : topB > topA ? "B" : null;

  function guncelle(hangisi: "a" | "b", alan: keyof Teklif, deger: string) {
    if (hangisi === "a") setA((prev) => ({ ...prev, [alan]: deger }));
    else setB((prev) => ({ ...prev, [alan]: deger }));
  }

  function TeklifForm({ t, tag }: { t: Teklif; tag: "a" | "b" }) {
    const renk = tag === "a" ? "blue" : "purple";
    const kazaniyorMu = kazanan === tag.toUpperCase();
    return (
      <div className={`bg-white rounded-2xl border-2 p-5 shadow-sm transition-all ${
        kazaniyorMu ? `border-${renk}-400 ring-2 ring-${renk}-100` : "border-slate-200"
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-7 h-7 rounded-lg bg-${renk}-600 flex items-center justify-center text-white text-xs font-bold`}>
            {tag.toUpperCase()}
          </div>
          <h2 className="font-bold text-slate-900">Teklif {tag.toUpperCase()}</h2>
          {kazaniyorMu && (
            <span className={`ml-auto text-xs font-semibold bg-${renk}-50 text-${renk}-700 px-2.5 py-1 rounded-full`}>
              ✓ Daha iyi
            </span>
          )}
        </div>
        <div className="space-y-3">
          <Alan label="Şirket adı">
            <input className={INPUT_CLS} value={t.sirket} onChange={(e) => guncelle(tag, "sirket", e.target.value)} placeholder="Şirket..." />
          </Alan>
          <Alan label="Pozisyon">
            <input className={INPUT_CLS} value={t.pozisyon} onChange={(e) => guncelle(tag, "pozisyon", e.target.value)} placeholder="Yazılım Mühendisi..." />
          </Alan>
          <Alan label="Brüt maaş (aylık ₺)">
            <input type="number" className={INPUT_CLS} value={t.maasAylik} onChange={(e) => guncelle(tag, "maasAylik", e.target.value)} placeholder="50000" />
          </Alan>
          <div className="grid grid-cols-2 gap-3">
            <Alan label="Yıllık bonus (₺)">
              <input type="number" className={INPUT_CLS} value={t.bonusYillik} onChange={(e) => guncelle(tag, "bonusYillik", e.target.value)} placeholder="0" />
            </Alan>
            <Alan label="Hisse/opsiyon (₺/yıl)">
              <input type="number" className={INPUT_CLS} value={t.hisseYillik} onChange={(e) => guncelle(tag, "hisseYillik", e.target.value)} placeholder="0" />
            </Alan>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Alan label="Ulaşım yardımı (₺/ay)">
              <input type="number" className={INPUT_CLS} value={t.ulaşım} onChange={(e) => guncelle(tag, "ulaşım", e.target.value)} placeholder="0" />
            </Alan>
            <Alan label="Yemek kartı (₺/gün)">
              <input type="number" className={INPUT_CLS} value={t.yemek} onChange={(e) => guncelle(tag, "yemek", e.target.value)} placeholder="0" />
            </Alan>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Alan label="Çalışma şekli">
              <select className={SELECT_CLS} value={t.remote} onChange={(e) => guncelle(tag, "remote", e.target.value)}>
                <option value="tam">Tam remote (+%5)</option>
                <option value="hibrit">Hibrit (+%2)</option>
                <option value="ofis">Ofis</option>
              </select>
            </Alan>
            <Alan label="Yıllık izin (gün)">
              <input type="number" className={INPUT_CLS} value={t.izinGun} onChange={(e) => guncelle(tag, "izinGun", e.target.value)} placeholder="14" />
            </Alan>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Alan label="Özel sağlık sigortası">
              <select className={SELECT_CLS} value={t.sigorta} onChange={(e) => guncelle(tag, "sigorta", e.target.value)}>
                <option value="evet">Evet (+6K₺/yıl)</option>
                <option value="hayır">Hayır</option>
              </select>
            </Alan>
            <Alan label="Eğitim bütçesi (₺/yıl)">
              <input type="number" className={INPUT_CLS} value={t.egitimButcesi} onChange={(e) => guncelle(tag, "egitimButcesi", e.target.value)} placeholder="0" />
            </Alan>
          </div>
        </div>

        {toplamYillik(t) > 0 && (
          <div className={`mt-4 pt-4 border-t border-slate-100 bg-${renk}-50 rounded-xl p-3`}>
            <p className="text-xs text-slate-500 mb-0.5">Tahmini toplam paket (yıllık)</p>
            <p className={`text-2xl font-bold text-${renk}-700`}>{fmt(toplamYillik(t))} ₺</p>
            <p className="text-xs text-slate-500 mt-0.5">≈ {fmt(toplamYillik(t) / 12)} ₺/ay eşdeğer</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Teklif Karşılaştırıcı</h1>
        <p className="text-slate-500 text-sm">
          İki iş teklifini tüm yan haklarıyla birlikte karşılaştır. Maaş tek bileşendir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TeklifForm t={a} tag="a" />
        <TeklifForm t={b} tag="b" />
      </div>

      {(topA > 0 || topB > 0) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-5">Karşılaştırma</h2>

          {kazanan ? (
            <div className={`rounded-xl p-4 mb-5 ${kazanan === "A" ? "bg-blue-50 border border-blue-200" : "bg-purple-50 border border-purple-200"}`}>
              <p className="font-bold text-slate-900">
                Teklif {kazanan} yıllık <span className={kazanan === "A" ? "text-blue-600" : "text-purple-600"}>{fmt(fark)} ₺</span> daha iyi
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                Aylık eşdeğer fark: {fmt(fark / 12)} ₺ · 5 yılda: {fmt(fark * 5)} ₺
              </p>
            </div>
          ) : topA > 0 && topB > 0 ? (
            <div className="rounded-xl p-4 mb-5 bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-900">İki teklif eşit değerde</p>
            </div>
          ) : null}

          {/* Karşılaştırma çubuğu */}
          {topA > 0 && topB > 0 && (
            <div className="space-y-3">
              {[
                { label: "Teklif A", value: topA, renk: "bg-blue-500", max: Math.max(topA, topB) },
                { label: "Teklif B", value: topB, renk: "bg-purple-500", max: Math.max(topA, topB) },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{item.label} {item.label === "Teklif A" ? (a.sirket || "") : (b.sirket || "")}</span>
                    <span className="font-bold text-slate-900">{fmt(item.value)} ₺/yıl</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.renk} rounded-full transition-all`} style={{ width: `${(item.value / item.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-slate-400 mt-4">
            * Remote primi, ekstra izin ve sigorta tahmini değer atamaları içerir. Gerçek vergi avantajları hesaba katılmamıştır.
          </p>
        </div>
      )}
    </div>
  );
}

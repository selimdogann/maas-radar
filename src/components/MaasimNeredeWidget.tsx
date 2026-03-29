"use client";

import { useState } from "react";

interface Props {
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR", { notation: "compact", maximumFractionDigits: 0 }).format(n) + " ₺";
}

export default function MaasimNeredeWidget({ p25, p50, p75, p90 }: Props) {
  const [maas, setMaas] = useState("");
  const [sonuc, setSonuc] = useState<string | null>(null);
  const [dilim, setDilim] = useState<number | null>(null);

  function hesapla() {
    const m = parseFloat(maas.replace(/\./g, "").replace(",", ".")) || 0;
    if (!m) return;
    if (m < p25) { setSonuc("Alt %25"); setDilim(10); }
    else if (m < p50) { setSonuc("%25–%50"); setDilim(35); }
    else if (m < p75) { setSonuc("%50–%75"); setDilim(62); }
    else if (m < p90) { setSonuc("%75–%90"); setDilim(82); }
    else { setSonuc("En üst %10"); setDilim(95); }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-1">Maaşım Nerede?</h3>
      <p className="text-slate-500 text-xs mb-4">Tüm verilere göre hangi dilimdesin?</p>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={maas}
          onChange={(e) => { setMaas(e.target.value); setSonuc(null); }}
          onKeyDown={(e) => e.key === "Enter" && hesapla()}
          placeholder="Aylık brüt maaşın"
          className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={hesapla} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          Hesapla
        </button>
      </div>

      {/* Percentile bar */}
      <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden mb-1">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 rounded-full" />
        {dilim !== null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-full shadow transition-all"
            style={{ left: `calc(${dilim}% - 6px)` }}
          />
        )}
      </div>
      <div className="flex justify-between text-xs text-slate-400 mb-3">
        <span>{fmt(p25)}</span>
        <span>{fmt(p50)}</span>
        <span>{fmt(p75)}</span>
        <span>{fmt(p90)}</span>
      </div>
      <div className="flex justify-between text-xs text-slate-300 -mt-2 mb-3">
        <span>P25</span>
        <span>P50</span>
        <span>P75</span>
        <span>P90</span>
      </div>

      {sonuc && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
          <p className="text-blue-800 text-sm font-semibold">Sen <span className="text-blue-600">{sonuc}</span> dilimindesi̇n</p>
        </div>
      )}
    </div>
  );
}

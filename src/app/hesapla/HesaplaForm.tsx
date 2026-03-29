"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  sektorler: string[];
  sehirler: string[];
  varsayilan: {
    sektor?: string;
    sehir?: string;
    deneyimMin?: string;
    deneyimMax?: string;
    egitim?: string;
  };
}

export default function HesaplaForm({ sektorler, sehirler, varsayilan }: Props) {
  const router = useRouter();
  const [sektor, setSektor] = useState(varsayilan.sektor || "");
  const [sehir, setSehir] = useState(varsayilan.sehir || "");
  const [deneyimMin, setDeneyimMin] = useState(varsayilan.deneyimMin || "0");
  const [deneyimMax, setDeneyimMax] = useState(varsayilan.deneyimMax || "50");
  const [egitim, setEgitim] = useState(varsayilan.egitim || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (sektor) params.set("sektor", sektor);
    if (sehir) params.set("sehir", sehir);
    if (deneyimMin) params.set("deneyimMin", deneyimMin);
    if (deneyimMax) params.set("deneyimMax", deneyimMax);
    if (egitim) params.set("egitim", egitim);
    router.push(`/hesapla?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Sektör <span className="text-red-500">*</span>
          </label>
          <select
            value={sektor}
            onChange={(e) => setSektor(e.target.value)}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Seçin</option>
            {sektorler.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Şehir
          </label>
          <select
            value={sehir}
            onChange={(e) => setSehir(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Tüm Şehirler</option>
            {sehirler.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Deneyim Aralığı (Yıl)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              max="50"
              value={deneyimMin}
              onChange={(e) => setDeneyimMin(e.target.value)}
              placeholder="Min"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <span className="text-slate-400 text-sm">–</span>
            <input
              type="number"
              min="0"
              max="50"
              value={deneyimMax}
              onChange={(e) => setDeneyimMax(e.target.value)}
              placeholder="Max"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Eğitim Seviyesi
          </label>
          <select
            value={egitim}
            onChange={(e) => setEgitim(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Tümü</option>
            <option value="Lise">Lise</option>
            <option value="Ön Lisans">Ön Lisans</option>
            <option value="Lisans">Lisans</option>
            <option value="Yüksek Lisans">Yüksek Lisans</option>
            <option value="Doktora">Doktora</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
      >
        Piyasa Değerimi Hesapla
      </button>
    </form>
  );
}

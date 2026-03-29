"use client";

import { useState } from "react";
import { freelanceEkle } from "@/lib/forumActions";

const SEKTORLER = [
  "Yazılım & Teknoloji", "Tasarım & Kreatif", "Pazarlama & Dijital",
  "Finans & Muhasebe", "Eğitim & Danışmanlık", "İçerik & Metin",
  "Video & Prodüksiyon", "Diğer",
];

export default function FreelanceForm() {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [basarili, setBasarili] = useState(false);
  const [hata, setHata] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setYukleniyor(true);
    setHata("");
    try {
      await freelanceEkle(new FormData(e.currentTarget));
      setBasarili(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setBasarili(false), 3000);
    } catch {
      setHata("Bir hata oluştu.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="pozisyon" required placeholder="Pozisyon / Uzmanlık *" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <select name="sektor" required className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Sektör seç *</option>
        {SEKTORLER.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <input name="sehir" required placeholder="Şehir *" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Saatlik ücret (₺)</label>
          <input type="number" name="saatlikUcret" placeholder="0" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Günlük ücret (₺)</label>
          <input type="number" name="gunlukUcret" placeholder="0" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input type="number" name="deneyimYil" required placeholder="Deneyim (yıl) *" min="0" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select name="calismaSekli" required className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Çalışma şekli *</option>
          <option value="Tam Remote">Tam Remote</option>
          <option value="Hibrit">Hibrit</option>
          <option value="Yerinde">Yerinde</option>
        </select>
      </div>
      {hata && <p className="text-red-500 text-xs">{hata}</p>}
      {basarili && <p className="text-emerald-600 text-xs font-medium">✅ Ücretin eklendi!</p>}
      <button type="submit" disabled={yukleniyor} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50">
        {yukleniyor ? "Gönderiliyor..." : "Ücreti Paylaş"}
      </button>
    </form>
  );
}

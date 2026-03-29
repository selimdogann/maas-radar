"use client";

import { useState } from "react";
import { mulakatEkle } from "@/lib/forumActions";

export default function MulakatForm() {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [basarili, setBasarili] = useState(false);
  const [hata, setHata] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setYukleniyor(true);
    setHata("");
    try {
      const formData = new FormData(e.currentTarget);
      await mulakatEkle(formData);
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
      <input
        name="sirket"
        type="text"
        required
        placeholder="Şirket adı *"
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="pozisyon"
        type="text"
        required
        placeholder="Başvurduğun pozisyon *"
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-2 gap-2">
        <select
          name="zorluk"
          required
          className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Zorluk *</option>
          <option value="Kolay">Kolay</option>
          <option value="Orta">Orta</option>
          <option value="Zor">Zor</option>
        </select>
        <select
          name="sonuc"
          required
          className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sonuç *</option>
          <option value="Teklif Aldım">Teklif Aldım</option>
          <option value="Reddedildim">Reddedildim</option>
          <option value="Beklemede">Beklemede</option>
        </select>
      </div>
      <textarea
        name="surec"
        required
        rows={3}
        placeholder="Mülakat süreci nasıldı? *"
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <textarea
        name="sorular"
        rows={2}
        placeholder="Sorulan sorular (opsiyonel)"
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-600 font-medium">Bu şirketi tavsiye eder misin?</label>
        <select
          name="olumlu"
          className="border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="true">👍 Evet</option>
          <option value="false">👎 Hayır</option>
        </select>
      </div>
      {hata && <p className="text-red-500 text-xs">{hata}</p>}
      {basarili && <p className="text-emerald-600 text-xs font-medium">✅ Deneyimin paylaşıldı!</p>}
      <button
        type="submit"
        disabled={yukleniyor}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
      >
        {yukleniyor ? "Gönderiliyor..." : "Deneyimi Paylaş"}
      </button>
    </form>
  );
}

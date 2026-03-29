"use client";

import { useState } from "react";
import { forumPostEkle } from "@/lib/forumActions";

interface Props {
  sektorler: string[];
  varsayilanSektor: string;
}

export default function ForumPostForm({ sektorler, varsayilanSektor }: Props) {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [basarili, setBasarili] = useState(false);
  const [hata, setHata] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setYukleniyor(true);
    setHata("");
    try {
      const formData = new FormData(e.currentTarget);
      await forumPostEkle(formData);
      setBasarili(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setBasarili(false), 3000);
    } catch {
      setHata("Bir hata oluştu, tekrar dene.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="baslik"
        type="text"
        required
        placeholder="Konu başlığı..."
        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        name="icerik"
        required
        rows={3}
        placeholder="Ne sormak veya paylaşmak istiyorsun?"
        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <div className="flex gap-3 items-center">
        <select
          name="sektor"
          defaultValue={varsayilanSektor || "Genel"}
          required
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sektorler.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          type="submit"
          disabled={yukleniyor}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
        >
          {yukleniyor ? "Gönderiliyor..." : "Paylaş"}
        </button>
      </div>
      {basarili && <p className="text-emerald-600 text-xs font-medium">✅ Konun paylaşıldı!</p>}
      {hata && <p className="text-red-500 text-xs">{hata}</p>}
    </form>
  );
}

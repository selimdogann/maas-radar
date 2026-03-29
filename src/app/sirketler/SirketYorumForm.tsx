"use client";

import { useState } from "react";
import { sirketYorumuEkle } from "@/lib/forumActions";

const KATEGORILER = [
  { name: "kultur", label: "Şirket Kültürü" },
  { name: "isYasamDengesi", label: "İş-Yaşam Dengesi" },
  { name: "yonetim", label: "Yönetim Kalitesi" },
  { name: "kariyer", label: "Kariyer Gelişimi" },
  { name: "maasYanHaklar", label: "Maaş & Yan Haklar" },
];

function YildizSecici({ name, label }: { name: string; label: string }) {
  const [secili, setSecili] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex justify-between items-center">
      <label className="text-xs text-slate-600">{label}</label>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setSecili(y)}
            onMouseEnter={() => setHover(y)}
            onMouseLeave={() => setHover(0)}
            className={`text-xl transition-colors ${(hover || secili) >= y ? "text-yellow-400" : "text-slate-300"}`}
          >
            ★
          </button>
        ))}
        <input type="hidden" name={name} value={secili} required />
      </div>
    </div>
  );
}

export default function SirketYorumForm() {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [basarili, setBasarili] = useState(false);
  const [hata, setHata] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setYukleniyor(true);
    setHata("");
    try {
      const formData = new FormData(e.currentTarget);
      await sirketYorumuEkle(formData);
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
        placeholder="Pozisyonun *"
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="space-y-2 bg-slate-50 rounded-lg p-3">
        {KATEGORILER.map((k) => (
          <YildizSecici key={k.name} name={k.name} label={k.label} />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-600">Bu şirketi tavsiye eder misin?</label>
        <select
          name="tavsiyeEder"
          className="border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="true">👍 Evet</option>
          <option value="false">👎 Hayır</option>
        </select>
      </div>

      <textarea
        name="olumluYon"
        rows={2}
        placeholder="Olumlu yönleri... (opsiyonel)"
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <textarea
        name="olumsuzYon"
        rows={2}
        placeholder="Geliştirilmesi gerekenler... (opsiyonel)"
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      {hata && <p className="text-red-500 text-xs">{hata}</p>}
      {basarili && <p className="text-emerald-600 text-xs font-medium">✅ Değerlendirmen eklendi!</p>}

      <button
        type="submit"
        disabled={yukleniyor}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
      >
        {yukleniyor ? "Gönderiliyor..." : "Değerlendirmeyi Paylaş"}
      </button>
    </form>
  );
}

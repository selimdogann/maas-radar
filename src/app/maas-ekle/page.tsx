"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { maasEkle } from "@/lib/actions";

const SEKTORLER = [
  "Yazılım & Teknoloji", "Finans & Bankacılık", "Sağlık", "Eğitim",
  "Perakende & E-Ticaret", "Üretim & Sanayi", "Medya & Reklam",
  "Lojistik & Ulaşım", "Hukuk", "İnşaat & Gayrimenkul", "Diğer",
];

const SEHIRLER = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya",
  "Adana", "Gaziantep", "Kocaeli", "Diğer",
];

export default function MaasEklePage() {
  const router = useRouter();
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [basarili, setBasarili] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setYukleniyor(true);
    setHata("");
    try {
      const formData = new FormData(e.currentTarget);
      await maasEkle(formData);
      localStorage.setItem("maasPaylasildi", "true");
      setBasarili(true);
      setTimeout(() => router.push("/maaslar"), 2000);
    } catch {
      setHata("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setYukleniyor(false);
    }
  }

  if (basarili) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Maaşın paylaşıldı!</h2>
        <p className="text-slate-500 text-sm">Maaşlar sayfasına yönlendiriliyorsun...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Maaşını Anonim Paylaş</h1>
        <p className="text-slate-500 text-sm">Kimliğin gizli kalır. Hiçbir kişisel bilgi istenmez.</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3 items-start">
        <span className="text-blue-500 text-lg mt-0.5">🔒</span>
        <p className="text-blue-700 text-sm">
          IP adresi veya kimlik bilgisi saklanmaz. Şirket adının yalnızca ilk 3 harfi gösterilir.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Şirket Adı <span className="text-red-500">*</span>
            </label>
            <input
              name="sirket"
              type="text"
              required
              placeholder="ör. Trendyol, Getir, Akbank"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-slate-400 mt-1">Sitede &quot;Tre***&quot; şeklinde görünür</p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Pozisyon / Unvan <span className="text-red-500">*</span>
            </label>
            <input
              name="pozisyon"
              type="text"
              required
              placeholder="ör. Senior Backend Developer, Muhasebe Uzmanı"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Sektör <span className="text-red-500">*</span>
            </label>
            <select
              name="sektor"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value="">Seçin</option>
              {SEKTORLER.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Şehir <span className="text-red-500">*</span>
            </label>
            <select
              name="sehir"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value="">Seçin</option>
              {SEHIRLER.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Deneyim (Yıl) <span className="text-red-500">*</span>
            </label>
            <input
              name="deneyimYil"
              type="number"
              required
              min="0"
              max="50"
              placeholder="ör. 3"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Çalışma Şekli <span className="text-red-500">*</span>
            </label>
            <select
              name="calismaSekli"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value="">Seçin</option>
              <option value="Ofis">Ofis</option>
              <option value="Remote">Remote</option>
              <option value="Hibrit">Hibrit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Eğitim Seviyesi <span className="text-red-500">*</span>
            </label>
            <select
              name="egitimSeviyesi"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value="">Seçin</option>
              <option value="Lise">Lise</option>
              <option value="Ön Lisans">Ön Lisans</option>
              <option value="Lisans">Lisans</option>
              <option value="Yüksek Lisans">Yüksek Lisans</option>
              <option value="Doktora">Doktora</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Cinsiyet
              <span className="text-slate-400 font-normal text-xs ml-1">opsiyonel · analiz için</span>
            </label>
            <select
              name="cinsiyet"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value="">Belirtmek istemiyorum</option>
              <option value="Kadın">Kadın</option>
              <option value="Erkek">Erkek</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Aylık Maaş (₺) <span className="text-red-500">*</span>
            </label>
            <input
              name="maasAylik"
              type="number"
              required
              min="0"
              placeholder="ör. 45000"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Yıllık Bonus (₺)
              <span className="text-slate-400 font-normal text-xs ml-1">opsiyonel</span>
            </label>
            <input
              name="bonusYillik"
              type="number"
              min="0"
              placeholder="ör. 100000"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {hata && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {hata}
          </div>
        )}

        <button
          type="submit"
          disabled={yukleniyor}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {yukleniyor ? "Kaydediliyor..." : "🔒 Anonim Olarak Paylaş"}
        </button>
      </form>
    </div>
  );
}

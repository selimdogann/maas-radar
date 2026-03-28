"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { maasEkle } from "@/lib/actions";

const SEKTORLER = [
  "Yazılım & Teknoloji",
  "Finans & Bankacılık",
  "Sağlık",
  "Eğitim",
  "Perakende & E-Ticaret",
  "Üretim & Sanayi",
  "Medya & Reklam",
  "Lojistik & Ulaşım",
  "Hukuk",
  "İnşaat & Gayrimenkul",
  "Diğer",
];

const SEHIRLER = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Gaziantep",
  "Kocaeli",
  "Diğer",
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
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Maaşın paylaşıldı!
        </h2>
        <p className="text-gray-600">Maaşlar sayfasına yönlendiriliyorsun...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Maaşını Anonim Paylaş
        </h1>
        <p className="text-gray-600">
          Kimliğin gizli kalır. Hiçbir kişisel bilgi istenmez.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex gap-3">
        <span className="text-blue-600 text-xl">🔒</span>
        <p className="text-blue-800 text-sm">
          Paylaştığın maaş bilgileri tamamen anonimdir. IP adresi veya
          kimlik bilgisi saklanmaz.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
        {/* Şirket */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Şirket Adı <span className="text-red-500">*</span>
          </label>
          <input
            name="sirket"
            type="text"
            required
            placeholder="ör. Trendyol, Getir, Sahibinden"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">
            Sitede ilk 3 harf gösterilir (ör. Tre***)
          </p>
        </div>

        {/* Pozisyon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pozisyon / Unvan <span className="text-red-500">*</span>
          </label>
          <input
            name="pozisyon"
            type="text"
            required
            placeholder="ör. Backend Developer, Muhasebe Uzmanı"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sektör & Şehir */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sektör <span className="text-red-500">*</span>
            </label>
            <select
              name="sektor"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Seç</option>
              {SEKTORLER.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şehir <span className="text-red-500">*</span>
            </label>
            <select
              name="sehir"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Seç</option>
              {SEHIRLER.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Deneyim & Çalışma Şekli */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deneyim (Yıl) <span className="text-red-500">*</span>
            </label>
            <input
              name="deneyimYil"
              type="number"
              required
              min="0"
              max="50"
              placeholder="ör. 3"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Çalışma Şekli <span className="text-red-500">*</span>
            </label>
            <select
              name="calismaSekli"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Seç</option>
              <option value="Ofis">Ofis</option>
              <option value="Remote">Remote</option>
              <option value="Hibrit">Hibrit</option>
            </select>
          </div>
        </div>

        {/* Eğitim */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Eğitim Seviyesi <span className="text-red-500">*</span>
          </label>
          <select
            name="egitimSeviyesi"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Seç</option>
            <option value="Lise">Lise</option>
            <option value="Ön Lisans">Ön Lisans</option>
            <option value="Lisans">Lisans</option>
            <option value="Yüksek Lisans">Yüksek Lisans</option>
            <option value="Doktora">Doktora</option>
          </select>
        </div>

        {/* Maaş & Bonus */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aylık Maaş (₺) <span className="text-red-500">*</span>
            </label>
            <input
              name="maasAylik"
              type="number"
              required
              min="0"
              placeholder="ör. 45000"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yıllık Bonus (₺)
              <span className="text-gray-400 text-xs ml-1">opsiyonel</span>
            </label>
            <input
              name="bonusYillik"
              type="number"
              min="0"
              placeholder="ör. 100000"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {yukleniyor ? "Kaydediliyor..." : "Maaşı Anonim Paylaş"}
        </button>
      </form>
    </div>
  );
}

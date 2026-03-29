"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

export default function GiveToGet({ children }: Props) {
  const [paylasti, setPaylasti] = useState(true); // varsayılan true, hydration sonrası kontrol et

  useEffect(() => {
    const durum = localStorage.getItem("maasPaylasildi");
    setPaylasti(durum === "true");
  }, []);

  if (paylasti) return <>{children}</>;

  return (
    <div className="relative">
      {/* Bulanık içerik */}
      <div className="blur-sm pointer-events-none select-none opacity-60">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center max-w-sm mx-4">
          <div className="text-4xl mb-3">🔓</div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">
            Verilere Erişmek İçin Paylaş
          </h3>
          <p className="text-slate-500 text-sm mb-5">
            Maaş verilerimiz topluluk tarafından oluşturuluyor.
            Sen de paylaşırsan tüm verilere erişirsin.
          </p>
          <Link
            href="/maas-ekle"
            className="block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            Maaşımı Paylaş ve Kilidi Aç
          </Link>
          <p className="text-xs text-slate-400 mt-3">Tamamen anonim · 2 dakika sürer</p>
        </div>
      </div>
    </div>
  );
}

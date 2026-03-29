"use client";

import Link from "next/link";
import { useState } from "react";

const ANA_LINKLER = [
  { href: "/maaslar", label: "Maaşlar" },
  { href: "/hesapla", label: "Ne Almalıyım?" },
  { href: "/forum", label: "Forum" },
  { href: "/mulakat", label: "Mülakat" },
  { href: "/sirketler", label: "Şirketler" },
];

const ARACLAR = [
  { href: "/net-maas", label: "Brüt → Net Hesap", icon: "🧮" },
  { href: "/teklif", label: "Teklif Karşılaştır", icon: "⚖️" },
  { href: "/kidem", label: "Kıdem Tazminatı", icon: "📋" },
  { href: "/yasam-maliyeti", label: "Yaşam Maliyeti", icon: "🏙️" },
  { href: "/sirket-siralama", label: "Şirket Sıralaması", icon: "🏆" },
  { href: "/rapor", label: "Maaş Raporu", icon: "📊" },
  { href: "/rehber", label: "Müzakere Rehberi", icon: "📚" },
  { href: "/premium", label: "Premium", icon: "⚡" },
];

export default function Navbar() {
  const [araclarAcik, setAraclarAcik] = useState(false);
  const [menuAcik, setMenuAcik] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:bg-blue-700 transition-colors">
            M
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            Maaş<span className="text-blue-600">Radar</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {ANA_LINKLER.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
            >
              {l.label}
            </Link>
          ))}

          {/* Araçlar dropdown */}
          <div className="relative">
            <button
              onClick={() => setAraclarAcik((v) => !v)}
              onBlur={() => setTimeout(() => setAraclarAcik(false), 150)}
              className={`flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm ${araclarAcik ? "bg-slate-100 text-slate-900" : ""}`}
            >
              Araçlar
              <svg className={`w-3.5 h-3.5 transition-transform ${araclarAcik ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {araclarAcik && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50">
                {ARACLAR.map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                  >
                    <span>{a.icon}</span>
                    <span>{a.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/maas-ekle"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm shadow-sm ml-2"
          >
            + Maaş Paylaş
          </Link>
        </nav>

        {/* Mobile: hamburger + maaş paylaş */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/maas-ekle"
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-xs shadow-sm"
          >
            + Paylaş
          </Link>
          <button
            onClick={() => setMenuAcik((v) => !v)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-5 h-0.5 bg-slate-700 mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-slate-700 mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-slate-700 transition-all" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuAcik && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-0.5">
          {[...ANA_LINKLER, ...ARACLAR].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuAcik(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              {"icon" in l && <span>{String(l.icon)}</span>}
              <span>{l.label}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

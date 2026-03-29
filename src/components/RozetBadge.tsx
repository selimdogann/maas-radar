"use client";

import { useEffect, useState } from "react";

const ROZETLER = [
  { min: 0, max: 0, label: "Ziyaretçi", renk: "bg-slate-100 text-slate-500", icon: "👀" },
  { min: 1, max: 2, label: "Katkıcı", renk: "bg-green-50 text-green-700", icon: "🌱" },
  { min: 3, max: 5, label: "Bronz Katkıcı", renk: "bg-amber-50 text-amber-700", icon: "🥉" },
  { min: 6, max: 10, label: "Gümüş Katkıcı", renk: "bg-slate-100 text-slate-600", icon: "🥈" },
  { min: 11, max: Infinity, label: "Altın Katkıcı", renk: "bg-yellow-50 text-yellow-700", icon: "🥇" },
];

export default function RozetBadge() {
  const [veriSayisi, setVeriSayisi] = useState(0);
  const [goster, setGoster] = useState(false);

  useEffect(() => {
    try {
      const paylasilan = localStorage.getItem("maasPaylasildi") === "true" ? 1 : 0;
      const toplam = parseInt(localStorage.getItem("katkilSayisi") || "0") + paylasilan;
      setVeriSayisi(toplam);
      setGoster(true);
    } catch {
      setGoster(false);
    }
  }, []);

  if (!goster) return null;

  const rozet = ROZETLER.findLast((r) => veriSayisi >= r.min) ?? ROZETLER[0];

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${rozet.renk}`}>
      <span>{rozet.icon}</span>
      <span>{rozet.label}</span>
    </div>
  );
}

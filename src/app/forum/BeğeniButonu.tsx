"use client";

import { useState } from "react";
import { forumBeğeniArtir } from "@/lib/forumActions";

export default function BeğeniButonu({ postId, baslangic }: { postId: number; baslangic: number }) {
  const [sayi, setSayi] = useState(baslangic);
  const [tiklandi, setTiklandi] = useState(false);

  async function handleClick() {
    if (tiklandi) return;
    setTiklandi(true);
    setSayi((s) => s + 1);
    await forumBeğeniArtir(postId);
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all ${
        tiklandi
          ? "bg-blue-100 text-blue-700 cursor-default"
          : "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      <span>{tiklandi ? "▲" : "△"}</span>
      <span>{sayi}</span>
    </button>
  );
}

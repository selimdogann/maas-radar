"use client";

import { useState } from "react";
import { forumYorumEkle } from "@/lib/forumActions";

export default function ForumYorumForm({ postId }: { postId: number }) {
  const [icerik, setIcerik] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [basarili, setBasarili] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!icerik.trim()) return;
    setYukleniyor(true);
    const fd = new FormData();
    fd.append("icerik", icerik);
    fd.append("postId", String(postId));
    await forumYorumEkle(fd);
    setIcerik("");
    setBasarili(true);
    setYukleniyor(false);
    setTimeout(() => setBasarili(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={icerik}
        onChange={(e) => setIcerik(e.target.value)}
        rows={3}
        placeholder="Yorumunu yaz..."
        required
        className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      {basarili && <p className="text-emerald-600 text-xs">✅ Yorumun eklendi!</p>}
      <button
        type="submit"
        disabled={yukleniyor || !icerik.trim()}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {yukleniyor ? "Gönderiliyor..." : "Yorum Yap"}
      </button>
    </form>
  );
}

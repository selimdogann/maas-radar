import { prisma } from "@/lib/db";
import ForumPostForm from "./ForumPostForm";
import Link from "next/link";

const SEKTORLER = [
  "Yazılım & Teknoloji", "Finans & Bankacılık", "Sağlık", "Eğitim",
  "Perakende & E-Ticaret", "Üretim & Sanayi", "Medya & Reklam",
  "Lojistik & Ulaşım", "Hukuk", "İnşaat & Gayrimenkul", "Genel",
];

const SEKTOR_RENKLER: Record<string, string> = {
  "Yazılım & Teknoloji": "bg-blue-50 text-blue-700 border-blue-200",
  "Finans & Bankacılık": "bg-green-50 text-green-700 border-green-200",
  "Sağlık": "bg-red-50 text-red-700 border-red-200",
  "Eğitim": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Perakende & E-Ticaret": "bg-purple-50 text-purple-700 border-purple-200",
  "Üretim & Sanayi": "bg-orange-50 text-orange-700 border-orange-200",
  "Genel": "bg-slate-50 text-slate-700 border-slate-200",
};

function getSektorRenk(sektor: string) {
  return SEKTOR_RENKLER[sektor] ?? "bg-slate-50 text-slate-700 border-slate-200";
}

function zamanFarki(tarih: Date) {
  const fark = Date.now() - new Date(tarih).getTime();
  const dk = Math.floor(fark / 60000);
  const sa = Math.floor(dk / 60);
  const gun = Math.floor(sa / 24);
  if (gun > 0) return `${gun} gün önce`;
  if (sa > 0) return `${sa} saat önce`;
  if (dk > 0) return `${dk} dk önce`;
  return "Az önce";
}

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ sektor?: string }>;
}) {
  const { sektor } = await searchParams;

  const postlar = await prisma.forumPost.findMany({
    where: { sektor: sektor || undefined },
    include: { yorumlar: true },
    orderBy: { olusturuldu: "desc" },
    take: 50,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Anonim Forum</h1>
        <p className="text-slate-500 text-sm">Kimliğin gizli. Dilediğini sor, paylaş, tartış.</p>
      </div>

      {/* Sektör filtreleri */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/forum"
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            !sektor ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
          }`}
        >
          Tümü
        </Link>
        {SEKTORLER.map((s) => (
          <Link
            key={s}
            href={`/forum?sektor=${encodeURIComponent(s)}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              sektor === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
            }`}
          >
            {s.split(" & ")[0]}
          </Link>
        ))}
      </div>

      {/* Yeni post formu */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
        <h2 className="font-semibold text-slate-800 mb-4 text-sm">Yeni Konu Aç</h2>
        <ForumPostForm sektorler={SEKTORLER} varsayilanSektor={sektor || ""} />
      </div>

      {/* Postlar */}
      {postlar.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="font-semibold text-slate-700 mb-1">Henüz konu yok</h3>
          <p className="text-slate-400 text-sm">İlk konuyu sen aç!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {postlar.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex justify-between items-start mb-2 gap-3">
                <h3 className="font-semibold text-slate-900 text-sm leading-snug">{post.baslik}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${getSektorRenk(post.sektor)}`}>
                  {post.sektor.split(" & ")[0]}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-3 leading-relaxed">{post.icerik}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>🕐 {zamanFarki(post.olusturuldu)}</span>
                <span>💬 {post.yorumlar.length} yorum</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

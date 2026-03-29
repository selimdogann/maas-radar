import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import ForumYorumForm from "./ForumYorumForm";

export const dynamic = "force-dynamic";

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

export default async function ForumDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = parseInt(id);
  if (isNaN(postId)) notFound();

  const post = await prisma.forumPost.findUnique({
    where: { id: postId },
    include: { yorumlar: { orderBy: { olusturuldu: "asc" } } },
  });
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/forum" className="text-sm text-blue-600 hover:underline mb-6 block">
        ← Forum&apos;a dön
      </Link>

      {/* Post */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
            {post.sektor}
          </span>
          <span className="text-xs text-slate-400">{zamanFarki(post.olusturuldu)}</span>
          <span className="text-xs text-slate-400">· {post.begeni} beğeni</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-3">{post.baslik}</h1>
        <p className="text-slate-700 leading-relaxed">{post.icerik}</p>
      </div>

      {/* Yorumlar */}
      <div className="mb-6">
        <h2 className="font-bold text-slate-800 mb-4">
          {post.yorumlar.length} Yorum
        </h2>
        {post.yorumlar.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">İlk yorumu yap!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {post.yorumlar.map((y, i) => (
              <div key={y.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                    {i + 1}
                  </div>
                  <span className="text-xs text-slate-400">{zamanFarki(y.olusturuldu)}</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{y.icerik}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Yorum formu */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Yorum Yaz</h3>
        <ForumYorumForm postId={post.id} />
      </div>
    </div>
  );
}

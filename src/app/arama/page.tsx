import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatMaas } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function AramaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const sorgu = q?.trim() || "";

  if (!sorgu) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Arama</h1>
        <AramaFormu baslangic="" />
        <div className="mt-10 text-center text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">Pozisyon, şirket veya sektör ara</p>
        </div>
      </div>
    );
  }

  const [maaslar, sirketler, pozisyonlar, forumPostlar, mulakatlar] = await Promise.all([
    prisma.salary.findMany({
      where: {
        OR: [
          { sirket: { contains: sorgu } },
          { pozisyon: { contains: sorgu } },
          { sektor: { contains: sorgu } },
        ],
      },
      take: 5,
      orderBy: { olusturuldu: "desc" },
    }),
    prisma.companyReview.groupBy({
      by: ["sirket"],
      where: { sirket: { contains: sorgu } },
      _count: { sirket: true },
      _avg: { kultur: true, isYasamDengesi: true, yonetim: true, kariyer: true, maasYanHaklar: true },
      orderBy: { _count: { sirket: "desc" } },
      take: 5,
    }),
    prisma.salary.groupBy({
      by: ["pozisyon"],
      where: { pozisyon: { contains: sorgu } },
      _count: { pozisyon: true },
      _avg: { maasAylik: true },
      orderBy: { _count: { pozisyon: "desc" } },
      take: 5,
    }),
    prisma.forumPost.findMany({
      where: {
        OR: [
          { baslik: { contains: sorgu } },
          { icerik: { contains: sorgu } },
        ],
      },
      take: 5,
      orderBy: { olusturuldu: "desc" },
    }),
    prisma.interview.findMany({
      where: {
        OR: [
          { sirket: { contains: sorgu } },
          { pozisyon: { contains: sorgu } },
        ],
      },
      take: 5,
      orderBy: { olusturuldu: "desc" },
    }),
  ]);

  const toplamSonuc = maaslar.length + sirketler.length + pozisyonlar.length + forumPostlar.length + mulakatlar.length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Arama</h1>
      <AramaFormu baslangic={sorgu} />

      <div className="mt-6 mb-4 flex items-center justify-between">
        <p className="text-slate-500 text-sm">
          <span className="font-semibold text-slate-900">&quot;{sorgu}&quot;</span> için {toplamSonuc} sonuç
        </p>
      </div>

      {toplamSonuc === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-4xl mb-3">😕</p>
          <p className="font-semibold text-slate-700">Sonuç bulunamadı</p>
          <p className="text-slate-400 text-sm mt-1">Farklı bir kelime dene</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Şirketler */}
        {sirketler.length > 0 && (
          <section>
            <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-3">🏢 Şirketler ({sirketler.length})</h2>
            <div className="space-y-2">
              {sirketler.map((s) => {
                const avg = (((s._avg.kultur ?? 0) + (s._avg.isYasamDengesi ?? 0) + (s._avg.yonetim ?? 0) + (s._avg.kariyer ?? 0) + (s._avg.maasYanHaklar ?? 0)) / 5).toFixed(1);
                return (
                  <Link key={s.sirket} href={`/sirket/${encodeURIComponent(s.sirket)}`}
                    className="flex justify-between items-center bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                    <div>
                      <p className="font-semibold text-slate-900">{s.sirket}</p>
                      <p className="text-xs text-slate-400">{s._count.sirket} değerlendirme</p>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 text-sm">{"★".repeat(Math.round(parseFloat(avg)))}</div>
                      <div className="text-xs font-bold text-slate-700">{avg} / 5</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Pozisyonlar */}
        {pozisyonlar.length > 0 && (
          <section>
            <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-3">💼 Pozisyonlar ({pozisyonlar.length})</h2>
            <div className="space-y-2">
              {pozisyonlar.map((p) => (
                <Link key={p.pozisyon} href={`/pozisyon/${encodeURIComponent(p.pozisyon)}`}
                  className="flex justify-between items-center bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div>
                    <p className="font-semibold text-slate-900">{p.pozisyon}</p>
                    <p className="text-xs text-slate-400">{p._count.pozisyon} veri</p>
                  </div>
                  <p className="font-bold text-blue-600">{formatMaas(Math.round(p._avg.maasAylik ?? 0))}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Maaş verileri */}
        {maaslar.length > 0 && (
          <section>
            <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-3">💰 Maaş Verileri</h2>
            <div className="space-y-2">
              {maaslar.map((m) => (
                <div key={m.id} className="flex justify-between items-center bg-white rounded-xl border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{m.pozisyon}</p>
                    <p className="text-xs text-slate-400">{m.sektor} · {m.sehir} · {m.deneyimYil} yıl</p>
                  </div>
                  <p className="font-bold text-slate-900">{formatMaas(m.maasAylik)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Forum */}
        {forumPostlar.length > 0 && (
          <section>
            <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-3">💬 Forum Konuları</h2>
            <div className="space-y-2">
              {forumPostlar.map((p) => (
                <Link key={p.id} href={`/forum/${p.id}`}
                  className="block bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                  <p className="font-semibold text-slate-900 text-sm">{p.baslik}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{p.icerik}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Mülakatlar */}
        {mulakatlar.length > 0 && (
          <section>
            <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-3">🎤 Mülakat Deneyimleri</h2>
            <div className="space-y-2">
              {mulakatlar.map((m) => (
                <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{m.sirket}</p>
                      <p className="text-xs text-slate-500">{m.pozisyon}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.sonuc === "Teklif Aldım" ? "bg-emerald-50 text-emerald-700" : m.sonuc === "Reddedildim" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"}`}>{m.sonuc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function AramaFormu({ baslangic }: { baslangic: string }) {
  return (
    <form action="/arama" method="GET">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
        <input
          name="q"
          type="text"
          defaultValue={baslangic}
          placeholder="Pozisyon, şirket, sektör ara..."
          autoFocus
          className="w-full border-2 border-slate-200 focus:border-blue-500 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none text-sm"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          Ara
        </button>
      </div>
    </form>
  );
}

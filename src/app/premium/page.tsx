import Link from "next/link";

const PLANLAR = [
  {
    id: "ucretsiz",
    isim: "Ücretsiz",
    fiyat: "0",
    birim: "",
    renk: "slate",
    aciklama: "Temel maaş verisine erişim",
    ozellikler: [
      { var: true, text: "Maaş verisi görüntüleme" },
      { var: true, text: "Maaş ekle" },
      { var: true, text: "Forum & topluluk" },
      { var: true, text: "Mülakat deneyimleri" },
      { var: true, text: "Maaş müzakere rehberi" },
      { var: false, text: "Sınırsız gelişmiş filtreleme" },
      { var: false, text: "CSV/PDF veri dışa aktarma" },
      { var: false, text: "Kişisel maaş raporu" },
      { var: false, text: "Şirket karşılaştırma aracı" },
      { var: false, text: "Öncelikli destek" },
    ],
    cta: "Şu an kullanıyorsun",
    ctaDisabled: true,
  },
  {
    id: "premium",
    isim: "Premium",
    fiyat: "99",
    birim: "/ ay",
    renk: "blue",
    aciklama: "Kariyer kararları için tam veri gücü",
    populer: true,
    ozellikler: [
      { var: true, text: "Maaş verisi görüntüleme" },
      { var: true, text: "Maaş ekle" },
      { var: true, text: "Forum & topluluk" },
      { var: true, text: "Mülakat deneyimleri" },
      { var: true, text: "Maaş müzakere rehberi" },
      { var: true, text: "Sınırsız gelişmiş filtreleme" },
      { var: true, text: "CSV/PDF veri dışa aktarma" },
      { var: true, text: "Kişisel maaş raporu" },
      { var: true, text: "Şirket karşılaştırma aracı" },
      { var: false, text: "Öncelikli destek" },
    ],
    cta: "Yakında",
    ctaDisabled: true,
  },
  {
    id: "kurumsal",
    isim: "Kurumsal",
    fiyat: "999",
    birim: "/ ay",
    renk: "purple",
    aciklama: "İK ve işe alım ekipleri için",
    ozellikler: [
      { var: true, text: "Premium özelliklerin tamamı" },
      { var: true, text: "Pozisyon bazlı benchmark raporu" },
      { var: true, text: "Anonim aday havuzu analizi" },
      { var: true, text: "İş ilanı yayınlama (3 ilan/ay)" },
      { var: true, text: "Şirket profil sayfası" },
      { var: true, text: "Çalışan yorumlarına yanıt verme" },
      { var: true, text: "API erişimi" },
      { var: true, text: "Özel maaş raporu (PDF)" },
      { var: true, text: "Öncelikli & özel destek" },
      { var: true, text: "Takım erişimi (5 hesap)" },
    ],
    cta: "İletişime geç",
    ctaDisabled: false,
    ctaHref: "/forum",
  },
];

const SORU_CEVAP = [
  { soru: "Verilerimi paylaşmak zorunlu mu?", cevap: "Hayır. Ancak Give-to-Get modelimiz kapsamında bazı özellikler veri paylaşımı gerektirebilir. Premium üyeler bu zorunluluktan muaftır." },
  { soru: "Verilerim güvende mi?", cevap: "Tüm veriler anonimdir. İsim, e-posta veya kimlik bilgisi saklanmaz. Şirket adları kısmen maskelenir. Hiçbir kişisel veri üçüncü taraflarla paylaşılmaz." },
  { soru: "Premium ne zaman açılacak?", cevap: "Premium üyelik yakında açılacak. Erken erişim için forum üzerinden bizimle iletişime geçebilirsin." },
  { soru: "Kurumsal plan için nasıl başvurabilirim?", cevap: "Forum sayfasındaki iletişim kanalından bize ulaşabilirsin. Özel fiyatlandırma ve ihtiyaçlarını konuşabiliriz." },
];

export default function PremiumPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Başlık */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          ⚡ Yakında
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Kariyer kararlarında veri gücü
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          MaaşRadar&apos;ı ücretsiz kullanmaya devam et ya da daha fazla özellik için planları keşfet.
        </p>
      </div>

      {/* Plan kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {PLANLAR.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border-2 p-6 shadow-sm relative flex flex-col ${
              plan.populer ? "border-blue-400 ring-4 ring-blue-50" : "border-slate-200"
            }`}
          >
            {plan.populer && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                En Popüler
              </div>
            )}
            <div className="mb-5">
              <h2 className={`font-bold text-lg text-${plan.renk === "slate" ? "slate" : plan.renk}-700 mb-0.5`}>{plan.isim}</h2>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-slate-900">{plan.fiyat === "0" ? "Ücretsiz" : `₺${plan.fiyat}`}</span>
                {plan.birim && <span className="text-slate-400 text-sm">{plan.birim}</span>}
              </div>
              <p className="text-slate-500 text-sm">{plan.aciklama}</p>
            </div>

            <ul className="space-y-2.5 flex-1 mb-6">
              {plan.ozellikler.map((o, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <span className={o.var ? "text-emerald-500" : "text-slate-300"}>
                    {o.var ? "✓" : "✗"}
                  </span>
                  <span className={o.var ? "text-slate-700" : "text-slate-400"}>{o.text}</span>
                </li>
              ))}
            </ul>

            {plan.ctaHref ? (
              <Link
                href={plan.ctaHref}
                className={`w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-colors bg-purple-600 text-white hover:bg-purple-700`}
              >
                {plan.cta}
              </Link>
            ) : (
              <button
                disabled={plan.ctaDisabled}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  plan.id === "premium"
                    ? "bg-blue-600 text-white opacity-50 cursor-not-allowed"
                    : "bg-slate-100 text-slate-500 cursor-default"
                }`}
              >
                {plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Özellik karşılaştırma */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-10">
        <h2 className="font-bold text-slate-900 text-lg mb-1">Neden Premium?</h2>
        <p className="text-slate-500 text-sm mb-6">Maaş müzakeresinde veri sahibi olmak fark yaratır.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: "📊", baslik: "Daha derin analiz", aciklama: "P10–P90 aralığı, deneyim eğrisi, şehir fark matrisi ve sektör trendi grafikleri" },
            { icon: "📥", baslik: "Veri dışa aktarma", aciklama: "Filtrelenmiş maaş verilerini CSV veya PDF olarak indir, Excel ile analiz et" },
            { icon: "🎯", baslik: "Kişisel rapor", aciklama: "Kendi pozisyon ve sektörüne göre özelleştirilmiş maaş raporu oluştur" },
          ].map((item) => (
            <div key={item.baslik} className="text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-1">{item.baslik}</h3>
              <p className="text-sm text-slate-500">{item.aciklama}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SSS */}
      <div className="mb-10">
        <h2 className="font-bold text-slate-900 text-xl mb-5 text-center">Sıkça Sorulan Sorular</h2>
        <div className="space-y-3">
          {SORU_CEVAP.map((item) => (
            <div key={item.soru} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-1.5">{item.soru}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.cevap}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA banner */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
        <h2 className="text-xl font-bold mb-2">Şimdi ücretsiz kullanmaya başla</h2>
        <p className="text-blue-100 text-sm mb-5">Maaş paylaş, verilere eriş. Kayıt zorunlu değil.</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/maas-ekle" className="bg-white text-blue-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors">
            Maaş Paylaş
          </Link>
          <Link href="/maaslar" className="bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-400 transition-colors border border-blue-400">
            Maaşları İncele
          </Link>
        </div>
      </div>
    </div>
  );
}

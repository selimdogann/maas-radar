import Link from "next/link";

const BOLUMLER = [
  {
    id: "arastir",
    icon: "🔍",
    baslik: "1. Piyasayı araştır",
    ozet: "Müzakereye başlamadan önce veriye dayalı bir zemin oluştur.",
    maddeler: [
      "MaaşRadar'da kendi pozisyonun, şehrin ve deneyim seviyene göre P25/P50/P75 aralığını bul.",
      "Aynı pozisyon için farklı sektörlerdeki maaş farklarına bak — teknoloji sektörü genellikle %20–40 daha yüksek öder.",
      "Hedef şirketin büyüklüğüne göre bant oluştur: startup, ölçek şirket ve kurumsal farklı bütçelere sahiptir.",
      "Güncel TÜFE ve enflasyon rakamlarını hesaba kat — nominal artış yeterli olmayabilir.",
    ],
    ipucu: "\"Şu an X alıyorum\" yerine \"piyasa araştırmam Y–Z aralığını gösteriyor\" de. Veri, güç demektir.",
  },
  {
    id: "zamanlama",
    icon: "⏱️",
    baslik: "2. Zamanlamayı doğru seç",
    ozet: "Maaş konuşmaları için en kötü an, işveren sormadan önce fiyat vermektir.",
    maddeler: [
      "Teklif aşamasına kadar bekle: \"Maaş beklentin nedir?\" sorusunu mümkün olduğunca ertelemek için 'aralık bekliyorum' gibi yumuşak yanıtlar kullan.",
      "Pozisyon teklifini aldıktan sonra müzakere et — kabul etmeden önce karşı teklife her zaman hakkın var.",
      "İşe başladıktan 6–12 ay sonra zam konuşmak için en uygun zaman: büyük bir proje teslimi veya performans döngüsü.",
      "Başka teklif almak güçlü bir müzakere aracıdır — ama gerçek olmayan teklifler risklidir.",
    ],
    ipucu: "İşveren maaşı sorarsa: \"Pozisyonun sorumluluklarını daha iyi anlayınca net bir rakam paylaşabilirim\" diyebilirsin.",
  },
  {
    id: "sayi",
    icon: "💡",
    baslik: "3. Doğru sayıyı söyle",
    ozet: "Rakam söyleme biçimin, rakamın kendisi kadar önemlidir.",
    maddeler: [
      "Yukarıdan başla: İstediğin rakamın %15–20 üzerinden başla — aşağı inmek daha kolaydır.",
      "Tek sayı ver, aralık verme: 'X–Y arası istiyorum' dersen işveren her zaman alt sınıra doğru gider.",
      "Yuvarlak sayılardan kaçın: 50.000 yerine 52.000 daha hesaplı bir araştırma yapıldığını gösterir.",
      "Yıllık değil aylık üzerinden konuş — Türkiye'de aylık brüt standart referans noktasıdır.",
    ],
    ipucu: "\"Bu rakam esnek değil\" yerine \"bu rakamı karşılayabilirseniz sabah işe başlayabilirim\" gibi pozitif bir ton kullan.",
  },
  {
    id: "paket",
    icon: "🎁",
    baslik: "4. Tüm paketi değerlendir",
    ozet: "Maaş tek bileşendir. Toplam ödül paketini optimize et.",
    maddeler: [
      "Yıllık bonus: Hedef bonusu ve ödeme garantisini netleştir. Şarta bağlı bonus, garanti bonus değildir.",
      "Hisse/opsiyon: Startup'larda vesting takvimi ve cliff süresini anla. 4 yıl vesting + 1 yıl cliff standart kabul görmektedir.",
      "Uzaktan çalışma: Ofis olmadan çalışmak, ulaşım ve zaman maliyetini azaltır — bunu maaş eşdeğerine çevir.",
      "Eğitim bütçesi, sağlık sigortası ve yemek kartı: Yıllık toplam değerini hesapla.",
      "Ek izin: Her ekstra izin günü aylık brütün 1/22'sine tekabül eder.",
    ],
    ipucu: "Maaşta anlaşmazlık varsa \"maaşı artıramazsanız başlangıç bonusu ekleyebilir misiniz?\" ile masayı açık tut.",
  },
  {
    id: "itiraz",
    icon: "🛡️",
    baslik: "5. İtirazları yönet",
    ozet: "\"Bütçemiz bu\" duyduğunda oyun bitmez.",
    maddeler: [
      "\"Bütçemiz sınırlı\" → \"Anlıyorum. Performansa bağlı 3 aylık revizyonu değerlendirebilir misiniz?\"",
      "\"Deneyimin yetersiz\" → \"Bu pozisyonda hızlı öğrendiğimi ispat etmek için 90 günlük hedefler koyalım, o noktada maaşı yeniden değerlendirelim.\"",
      "\"Mevcut maaşının üstünde bir teklif veriyoruz\" → \"Mevcut maaşım benim için referans değil, piyasa değerim referansım.\"",
      "\"Sana geri döneceğiz\" → \"Ne zaman karar vermenizi bekliyorsunuz? Başka süreçlerim var, önceliklendirmem gerekiyor.\"",
    ],
    ipucu: "Redde hazır ol — ama bir kez daha sor. \"Anlıyorum. Şu an bu rakamı verilebilecek maksimum olduğunu kesin söyleyebilir misiniz?\"",
  },
  {
    id: "zam",
    icon: "📈",
    baslik: "6. Zam müzakeresi",
    ozet: "İşte çalışırken maaş artışı istemek, teklif almaktan farklıdır.",
    maddeler: [
      "Somut değer belgele: \"X projesini bitirdim, Y kadar tasarruf sağladım\" formatı en güçlü argümandır.",
      "Enflasyona odaklanma, değere odaklan: \"Enflasyon var\" herkesin söylediği bir şeydir; \"şirketin gelirine şu kadar katkı sağladım\" daha güçlüdür.",
      "Rakam getir: Piyasa araştırması yap, MaaşRadar'dan veri al ve toplantıya belgeli git.",
      "İki yolun oluşsun: \"Evet\" veya \"ne zaman gözden geçirebiliriz?\" — sadece redde yer bırakma.",
      "Teklif kartı: Dış teklif aldıysan ve gerçekten gidebiliyorsan paylaşmaktan çekinme. Ama blöf yapma.",
    ],
    ipucu: "\"Maaşımı artırmanızı istiyorum\" yerine \"katkılarımı göz önünde bulundurarak maaşımı değerlendirmenizi talep ediyorum\" daha profesyoneldir.",
  },
];

export default function RehberPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <span>📚</span> Ücretsiz Rehber
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          Maaş Müzakere Rehberi
        </h1>
        <p className="text-slate-500 text-base leading-relaxed">
          Türkiye iş piyasasında maaş müzakeresinde nasıl daha fazla kazanırsın?
          Araştırmadan itiraza, zamdan toplam pakete kadar pratik rehber.
        </p>
      </div>

      {/* İçindekiler */}
      <div className="bg-slate-50 rounded-2xl p-5 mb-10 border border-slate-200">
        <h2 className="font-semibold text-slate-700 text-sm mb-3">İçindekiler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {BOLUMLER.map((b) => (
            <a
              key={b.id}
              href={`#${b.id}`}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors py-0.5"
            >
              <span>{b.icon}</span>
              <span>{b.baslik}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Bölümler */}
      <div className="space-y-10">
        {BOLUMLER.map((b) => (
          <section key={b.id} id={b.id} className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{b.icon}</span>
              <h2 className="text-xl font-bold text-slate-900">{b.baslik}</h2>
            </div>
            <p className="text-slate-500 text-sm mb-4">{b.ozet}</p>
            <ul className="space-y-2.5 mb-4">
              {b.maddeler.map((m, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                  <span className="text-blue-400 mt-0.5 shrink-0">→</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">💬 İpucu: </span>
                {b.ipucu}
              </p>
            </div>
          </section>
        ))}
      </div>

      {/* Hızlı araçlar CTA */}
      <div className="mt-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h2 className="font-bold text-lg mb-2">Piyasa verinle güçlen</h2>
        <p className="text-blue-100 text-sm mb-4">
          Müzakereye gitmeden önce kendi pozisyonun için gerçek piyasa rakamlarını kontrol et.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/hesapla"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            Maaşım Ne Olmalı?
          </Link>
          <Link
            href="/maaslar"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-400 transition-colors border border-blue-400"
          >
            Maaşları İncele
          </Link>
          <Link
            href="/rapor"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-400 transition-colors border border-blue-400"
          >
            Maaş Raporu
          </Link>
        </div>
      </div>

      {/* Footer notu */}
      <p className="text-center text-xs text-slate-400 mt-8">
        Bu rehber MaaşRadar tarafından Türkiye iş piyasası koşulları gözetilerek hazırlanmıştır.
      </p>
    </div>
  );
}

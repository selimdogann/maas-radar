import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const veriler = [
  { sirket: "Trendyol", pozisyon: "Senior Backend Developer", sektor: "Yazılım & Teknoloji", sehir: "İstanbul", deneyimYil: 5, maasAylik: 120000, bonusYillik: 200000, calismaSekli: "Hibrit", egitimSeviyesi: "Lisans" },
  { sirket: "Getir", pozisyon: "Frontend Developer", sektor: "Yazılım & Teknoloji", sehir: "İstanbul", deneyimYil: 3, maasAylik: 75000, bonusYillik: 100000, calismaSekli: "Remote", egitimSeviyesi: "Lisans" },
  { sirket: "Hepsiburada", pozisyon: "Product Manager", sektor: "Perakende & E-Ticaret", sehir: "İstanbul", deneyimYil: 6, maasAylik: 95000, bonusYillik: 150000, calismaSekli: "Hibrit", egitimSeviyesi: "Yüksek Lisans" },
  { sirket: "Akbank", pozisyon: "Yazılım Mühendisi", sektor: "Finans & Bankacılık", sehir: "İstanbul", deneyimYil: 4, maasAylik: 85000, bonusYillik: 120000, calismaSekli: "Ofis", egitimSeviyesi: "Lisans" },
  { sirket: "Garanti BBVA", pozisyon: "Data Analyst", sektor: "Finans & Bankacılık", sehir: "İstanbul", deneyimYil: 2, maasAylik: 55000, bonusYillik: 60000, calismaSekli: "Hibrit", egitimSeviyesi: "Lisans" },
  { sirket: "Türk Telekom", pozisyon: "Network Engineer", sektor: "Yazılım & Teknoloji", sehir: "Ankara", deneyimYil: 7, maasAylik: 70000, bonusYillik: 80000, calismaSekli: "Ofis", egitimSeviyesi: "Lisans" },
  { sirket: "Sahibinden", pozisyon: "iOS Developer", sektor: "Yazılım & Teknoloji", sehir: "İstanbul", deneyimYil: 4, maasAylik: 90000, bonusYillik: 120000, calismaSekli: "Remote", egitimSeviyesi: "Lisans" },
  { sirket: "Yemeksepeti", pozisyon: "DevOps Engineer", sektor: "Yazılım & Teknoloji", sehir: "İstanbul", deneyimYil: 3, maasAylik: 80000, bonusYillik: 90000, calismaSekli: "Hibrit", egitimSeviyesi: "Lisans" },
  { sirket: "Memorial Hastanesi", pozisyon: "Uzman Doktor", sektor: "Sağlık", sehir: "İstanbul", deneyimYil: 10, maasAylik: 150000, bonusYillik: null, calismaSekli: "Ofis", egitimSeviyesi: "Doktora" },
  { sirket: "Anadolu Sigorta", pozisyon: "Aktüer", sektor: "Finans & Bankacılık", sehir: "İstanbul", deneyimYil: 5, maasAylik: 90000, bonusYillik: 100000, calismaSekli: "Hibrit", egitimSeviyesi: "Lisans" },
  { sirket: "Koç Holding", pozisyon: "İş Geliştirme Uzmanı", sektor: "Üretim & Sanayi", sehir: "İstanbul", deneyimYil: 4, maasAylik: 65000, bonusYillik: 80000, calismaSekli: "Ofis", egitimSeviyesi: "Yüksek Lisans" },
  { sirket: "Sabancı Holding", pozisyon: "Finans Uzmanı", sektor: "Finans & Bankacılık", sehir: "İstanbul", deneyimYil: 3, maasAylik: 60000, bonusYillik: 70000, calismaSekli: "Ofis", egitimSeviyesi: "Lisans" },
  { sirket: "TTNET", pozisyon: "Junior Developer", sektor: "Yazılım & Teknoloji", sehir: "Ankara", deneyimYil: 1, maasAylik: 35000, bonusYillik: null, calismaSekli: "Ofis", egitimSeviyesi: "Lisans" },
  { sirket: "Arçelik", pozisyon: "Yazılım Mühendisi", sektor: "Üretim & Sanayi", sehir: "İstanbul", deneyimYil: 5, maasAylik: 72000, bonusYillik: 85000, calismaSekli: "Hibrit", egitimSeviyesi: "Lisans" },
  { sirket: "Turkcell", pozisyon: "Data Scientist", sektor: "Yazılım & Teknoloji", sehir: "İstanbul", deneyimYil: 4, maasAylik: 88000, bonusYillik: 110000, calismaSekli: "Hibrit", egitimSeviyesi: "Yüksek Lisans" },
  { sirket: "Migros", pozisyon: "Kategori Müdürü", sektor: "Perakende & E-Ticaret", sehir: "İstanbul", deneyimYil: 8, maasAylik: 78000, bonusYillik: 90000, calismaSekli: "Ofis", egitimSeviyesi: "Lisans" },
  { sirket: "Boyner", pozisyon: "E-Ticaret Uzmanı", sektor: "Perakende & E-Ticaret", sehir: "İstanbul", deneyimYil: 2, maasAylik: 42000, bonusYillik: 50000, calismaSekli: "Hibrit", egitimSeviyesi: "Lisans" },
  { sirket: "Eczacıbaşı", pozisyon: "İnsan Kaynakları Uzmanı", sektor: "Üretim & Sanayi", sehir: "İstanbul", deneyimYil: 3, maasAylik: 48000, bonusYillik: 55000, calismaSekli: "Hibrit", egitimSeviyesi: "Lisans" },
  { sirket: "Intertech", pozisyon: "Full Stack Developer", sektor: "Yazılım & Teknoloji", sehir: "İstanbul", deneyimYil: 4, maasAylik: 82000, bonusYillik: 95000, calismaSekli: "Remote", egitimSeviyesi: "Lisans" },
  { sirket: "Logo Yazılım", pozisyon: "Backend Developer", sektor: "Yazılım & Teknoloji", sehir: "Kocaeli", deneyimYil: 3, maasAylik: 58000, bonusYillik: 65000, calismaSekli: "Hibrit", egitimSeviyesi: "Lisans" },
  { sirket: "Vodafone TR", pozisyon: "Proje Yöneticisi", sektor: "Yazılım & Teknoloji", sehir: "İstanbul", deneyimYil: 6, maasAylik: 95000, bonusYillik: 120000, calismaSekli: "Hibrit", egitimSeviyesi: "Yüksek Lisans" },
  { sirket: "Aselsan", pozisyon: "Gömülü Yazılım Mühendisi", sektor: "Üretim & Sanayi", sehir: "Ankara", deneyimYil: 5, maasAylik: 68000, bonusYillik: 75000, calismaSekli: "Ofis", egitimSeviyesi: "Lisans" },
  { sirket: "Roketsan", pozisyon: "Sistem Mühendisi", sektor: "Üretim & Sanayi", sehir: "Ankara", deneyimYil: 7, maasAylik: 80000, bonusYillik: 90000, calismaSekli: "Ofis", egitimSeviyesi: "Yüksek Lisans" },
  { sirket: "Softtech", pozisyon: "Kıdemli Yazılım Uzmanı", sektor: "Yazılım & Teknoloji", sehir: "İstanbul", deneyimYil: 6, maasAylik: 92000, bonusYillik: 110000, calismaSekli: "Remote", egitimSeviyesi: "Lisans" },
  { sirket: "İzmir Üniversitesi", pozisyon: "Araştırma Görevlisi", sektor: "Eğitim", sehir: "İzmir", deneyimYil: 2, maasAylik: 28000, bonusYillik: null, calismaSekli: "Ofis", egitimSeviyesi: "Yüksek Lisans" },
];

async function main() {
  console.log("Örnek veriler ekleniyor...");
  await prisma.salary.deleteMany();
  for (const veri of veriler) {
    await prisma.salary.create({ data: veri });
  }
  console.log(`✅ ${veriler.length} maaş verisi eklendi.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

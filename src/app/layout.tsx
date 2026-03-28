import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maaş Radar – Türkiye Anonim Maaş Platformu",
  description:
    "Türkiye'deki gerçek maaşları anonim olarak keşfet. Sektör, şirket ve şehre göre filtreleyerek adil maaş talep et.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={geist.className}>
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">📡</span>
              <span className="font-bold text-xl text-gray-900">Maaş Radar</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/maaslar"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Maaşlara Bak
              </Link>
              <Link
                href="/maas-ekle"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Maaşını Paylaş
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-200 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>Maaş Radar – Tüm veriler anonimdir. Kimse kim olduğunu bilemez.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

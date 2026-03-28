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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={geist.className}>
      <body className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:bg-blue-700 transition-colors">
                M
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                Maaş<span className="text-blue-600">Radar</span>
              </span>
            </Link>
            <nav className="flex items-center gap-2">
              <Link
                href="/maaslar"
                className="hidden sm:block text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
              >
                Maaşları Keşfet
              </Link>
              <Link
                href="/maas-ekle"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm shadow-sm"
              >
                + Maaş Paylaş
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-white border-t border-slate-200 py-10 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold">M</div>
                <span className="font-semibold text-slate-700">MaaşRadar</span>
              </div>
              <p className="text-slate-400 text-sm text-center">
                Tüm veriler anonimdir. Hiçbir kişisel bilgi saklanmaz.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

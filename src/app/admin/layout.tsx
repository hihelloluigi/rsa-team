import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });

export const metadata: Metadata = { robots: { index: false, follow: false } };

// The admin sits outside app/[lang] — it is one person's tool, in one language,
// and must not be prerendered per locale — so it needs a root layout of its
// own. Deliberately bare: no navbar, footer, analytics or cookie notice.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} ${anton.variable}`}>
      <body className="bg-bg text-fg font-sans min-h-screen">{children}</body>
    </html>
  );
}

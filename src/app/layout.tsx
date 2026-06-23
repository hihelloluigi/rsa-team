import type { Metadata, Viewport } from "next";
import { Inter, Anton } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { siteUrl } from "@/lib/site";
import { getClub } from "@/lib/data";
import { sportsTeamLd, websiteLd } from "@/lib/structured-data";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });

const title = "RSA TEAM — Siamo Matti";
const description =
  "La squadra che gioca all'attacco perché difendere è troppa fatica. Rosa, partite e classifica dell'RSA TEAM.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: title, template: "%s — RSA TEAM" },
  description,
  alternates: { canonical: "/" },
  // No title/description here on purpose: Next derives og:/twitter: title and
  // description from each page's own title/description. The opengraph-image
  // file convention supplies the image site-wide.
  openGraph: { type: "website", locale: "it_IT", siteName: "RSA TEAM" },
  twitter: { card: "summary_large_image" },
  // Home-screen label on iOS; icons/manifest are wired via app/ file conventions.
  appleWebApp: { title: "RSA" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const club = getClub();
  return (
    <html lang="it" className={`${inter.variable} ${anton.variable}`}>
      <body className="bg-bg text-fg font-sans min-h-screen flex flex-col">
        <JsonLd data={[sportsTeamLd(club), websiteLd()]} />
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

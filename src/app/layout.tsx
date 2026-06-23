import type { Metadata, Viewport } from "next";
import { Inter, Anton } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteUrl } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });

const title = "RSA TEAM — Siamo Matti";
const description =
  "La squadra che gioca all'attacco perché difendere è troppa fatica. Rosa, partite e classifica dell'RSA TEAM.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: title, template: "%s" },
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "it_IT",
    siteName: "RSA TEAM",
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description },
  // Home-screen label on iOS; icons/manifest are wired via app/ file conventions.
  appleWebApp: { title: "RSA" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} ${anton.variable}`}>
      <body className="bg-bg text-fg font-sans min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

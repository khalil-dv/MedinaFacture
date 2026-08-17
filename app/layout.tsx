import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : undefined;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "IziFacture — Facturation simple pour entrepreneurs",
    template: "%s | IziFacture",
  },
  description:
    "Facturez en FCFA, suivez vos paiements et gérez vos clients. La facturation pensée pour les entrepreneurs africains.",
  applicationName: "IziFacture",
  keywords: [
    "facturation",
    "factures",
    "devis",
    "gestion de paiements",
    "entrepreneurs",
    "Afrique",
  ],
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "IziFacture — Facturation simple pour entrepreneurs",
    description:
      "Facturez, suivez vos paiements et gérez vos clients. La facturation pensée pour les entrepreneurs africains.",
    type: "website",
    locale: "fr_FR",
    siteName: "IziFacture",
  },
  twitter: {
    card: "summary",
    title: "IziFacture — Facturation simple pour entrepreneurs",
    description:
      "Facturez, suivez vos paiements et gérez vos clients. La facturation pensée pour les entrepreneurs africains.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('izifacture-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

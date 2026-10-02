import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./redesign.css";
import { ServiceWorkerRegistrar } from "@/components/pwa/ServiceWorkerRegistrar";

const sourceSans = localFont({
  src: [
    {path: "./fonts/source-sans-3-latin-ext.woff2", weight: "400 700", style: "normal"},
    {path: "./fonts/source-sans-3-latin.woff2", weight: "400 700", style: "normal"},
  ],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif = localFont({
  src: [
    {path: "./fonts/source-serif-4-latin-ext.woff2", weight: "400 700", style: "normal"},
    {path: "./fonts/source-serif-4-latin.woff2", weight: "400 700", style: "normal"},
  ],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://evangelizae.org'),
  applicationName: "Evangelizae",
  title: {
    default: "Evangelizae — oração para a vida cotidiana",
    template: "%s — Evangelizae",
  },
  description: "Um companheiro católico, gratuito e sereno para rezar o Rosário e acompanhar a liturgia diária.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Evangelizae",
    title: "Evangelizae — oração para a vida cotidiana",
    description: "Um companheiro católico, gratuito e sereno para rezar o Rosário e acompanhar a liturgia diária.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evangelizae — oração para a vida cotidiana",
    description: "Rosário guiado e liturgia diária, sem anúncios, rankings ou distrações.",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      {url: "/evangelizae-icon-v5.svg", type: "image/svg+xml"},
      {url: "/icon-v5-192.png", sizes: "192x192", type: "image/png"},
      {url: "/icon-v5-512.png", sizes: "512x512", type: "image/png"},
    ],
    apple: [{url: "/apple-touch-icon-v5.png", sizes: "180x180", type: "image/png"}],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#f3ecdf'},
    {media: '(prefers-color-scheme: dark)', color: '#171916'},
  ],
};

const devServiceWorkerPurge = `
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    registrations.forEach(function (registration) { registration.unregister(); });
  });
  if (window.caches) {
    caches.keys().then(function (keys) { keys.forEach(function (key) { caches.delete(key); }); });
  }
}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning data-scroll-behavior="smooth" className={`${sourceSans.variable} ${sourceSerif.variable}`}>
      <body>
        {children}
        <ServiceWorkerRegistrar />
        {process.env.NODE_ENV !== 'production' && (
          <script dangerouslySetInnerHTML={{__html: devServiceWorkerPurge}} />
        )}
      </body>
    </html>
  );
}

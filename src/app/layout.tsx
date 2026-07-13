import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evangelizae — Companheiro Diário para a Vida Cristã",
  description: "Plataforma missionária digital para a verdade católica e vida diária de oração. Em estrita fidelidade ao Magistério da Igreja.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-vatican-bg dark:bg-marian-midnight text-foreground transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}

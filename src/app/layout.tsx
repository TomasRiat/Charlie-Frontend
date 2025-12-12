import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/Providers";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Charlie Bot | Discord Music & Virtual Pet",
  description: "The best Hi-Fi music bot with a Tamagotchi-style pet system. El mejor bot de música Hi-Fi con sistema de mascota virtual para tu servidor.",
  keywords: ["Discord Bot", "Music Bot", "Virtual Pet", "Bot de Música", "Tamagotchi Discord", "Charlie Bot"],
  icons: {
    icon: '/logo.png', // Automático si el archivo existe
  },
  openGraph: {
    title: "Charlie Bot 2.0 🐱🎧",
    description: "Music & Pets. Escucha música 24/7 y cuida a Charlie. Join the fun!",
    url: 'https://charliebot.net',
    siteName: 'Charlie Bot',
    locale: 'en_US',
    alternateLocale: 'es_ES',
    type: 'website',
  },

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-amber-300 via-cyan-300 to-amber-300">
          <main className="container mx-auto">
            <Providers>{children}</Providers>
          </main>
        </div>
      </body>
    </html>
  );
}
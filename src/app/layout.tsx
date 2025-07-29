import type { Metadata } from "next";
import { Geist_Mono, Playfair_Display, Anonymous_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const anonymousPro = Anonymous_Pro({
  variable: "--font-anonymous-pro",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KRUZA",
  description: "Explora la moda con KRUZA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${anonymousPro.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased w-full `}
      >
        <Providers>
          {children}
          </Providers>
      </body>
    </html>
  );
}

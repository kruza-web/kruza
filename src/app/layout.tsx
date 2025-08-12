import type { Metadata } from "next";
import { Geist_Mono, Roboto, Anonymous_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
})

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
        className={`${roboto.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased w-full `}
      >
        <Providers>
          {children}
          </Providers>
      </body>
    </html>
  );
}

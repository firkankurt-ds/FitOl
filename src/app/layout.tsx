import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import SessionProvider from "@/components/providers/SessionProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant"
});

export const metadata: Metadata = {
  title: "FitOl - Fitness Tracker",
  description: "Track your workouts and progress with style",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FitOl",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${cormorant.variable} antialiased font-sans bg-slate-950 text-slate-100 min-h-screen relative`}
      >
        <div className="fixed inset-0 z-[-1]">
          <img src="/bg-signin.png" alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950/95"></div>
        </div>
        <Head>
          <link rel="apple-touch-icon" href="/icon-180.png" />
          <meta name="theme-color" content="#000000" />
        </Head>

        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

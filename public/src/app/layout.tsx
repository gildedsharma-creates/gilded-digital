import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gilded Sharma | React Developer & Handcrafted Decor",
  description:
    "Portfolio of Kundan Kumar Sharma (Gilded Sharma). Web & mobile development services alongside handcrafted decorative pieces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-neutral-950 text-neutral-100 antialiased selection:bg-amber-500/30 selection:text-amber-200`}
      >
        <AuthProvider>
  <CartProvider>
    <Navbar />
    <main className="flex-1">{children}</main>
    {/* Footer */}
  </CartProvider>
</AuthProvider>
      </body>
    </html>
  );
}
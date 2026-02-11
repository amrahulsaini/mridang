import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import WhatsAppFloating from "./components/WhatsAppFloating";
import LoadingSpinner from "./components/LoadingSpinner";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mridang - Handcrafted with Love | Premium Ring & Haldi Platters",
  description: "Beautiful handcrafted ring platters, haldi platters, and mehendi platters for your special occasions. Custom designs available with premium quality craftsmanship.",
  keywords: "ring platters, haldi platters, mehendi platters, wedding platters, handcrafted platters, custom platters, ceremony platters",
  authors: [{ name: "Mridang" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: "#800020",
  openGraph: {
    type: "website",
    title: "Mridang - Handcrafted Premium Platters",
    description: "Beautiful handcrafted platters for your special occasions",
    siteName: "Mridang",
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
        className={`${sora.variable} antialiased`}
      >
        <LoadingSpinner />
        <CartProvider>
          <NotificationProvider>
            {children}
            <WhatsAppFloating />
          </NotificationProvider>
        </CartProvider>
      </body>
    </html>
  );
}

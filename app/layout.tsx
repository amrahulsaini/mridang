import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import WhatsAppFloating from "./components/WhatsAppFloating";
import LoadingSpinner from "./components/LoadingSpinner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
  themeColor: "#6B2D3E",
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
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <CartProvider>
          <NotificationProvider>
            <LoadingSpinner />
            {children}
            <WhatsAppFloating />
          </NotificationProvider>
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import WhatsAppFloating from "./components/WhatsAppFloating";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mridang - Handcrafted with Love",
  description: "Beautiful handcrafted ring platters, haldi platters, and mehendi platters for your special occasions. Custom designs available.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
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

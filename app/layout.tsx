import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mridang - Handcrafted with Love",
  description: "Beautiful handcrafted ring platters, haldi platters, and mehendi platters for your special occasions. Custom designs available.",
  icons: {
    icon: [
      { url: '/logo-icon.ico' },
      { url: '/logo-icon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/logo-icon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/logo-icon.ico',
    apple: '/logo-icon.ico',
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
          </NotificationProvider>
        </CartProvider>
      </body>
    </html>
  );
}

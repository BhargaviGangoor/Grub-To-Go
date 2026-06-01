import "./globals.css";
import { Fredoka, Quicksand, JetBrains_Mono } from "next/font/google";

const headingFont = Fredoka({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Quicksand({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "GrubToGo — Authentic Flavours & Secure Dining Leases",
  description: "A gorgeous demonstration of cryptographic dining leases protecting customers against state drift and commitment mismatch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="font-body bg-[#f4f1ea] text-[#1c2e24] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

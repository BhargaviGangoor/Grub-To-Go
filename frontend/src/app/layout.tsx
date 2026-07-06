import "./globals.css";
import {
  Cormorant_Garamond,
  Quicksand,
  JetBrains_Mono,
} from "next/font/google";
import { StateProvider } from "@/context/StateContext";
import { MotionConfig } from "framer-motion";

const headingFont = Cormorant_Garamond({
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
  title: "GrubToGo — Secure Dining Leases & State Verification Dashboard",
  description:
    "A research prototype studying Commitment Amplification risks in agentic systems using Generation-Bound Dynamic Commitment Tokens.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <body className="font-sans min-h-screen bg-[#f3eedf] text-[#1d3a2b] antialiased selection:bg-emerald-800/15 selection:text-[#1d3a2b]">
        <MotionConfig reducedMotion="user">
          <StateProvider>{children}</StateProvider>
        </MotionConfig>
      </body>
    </html>
  );
}

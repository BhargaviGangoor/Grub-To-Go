import "./globals.css";
import {
  Fredoka,
  Nunito,
  Dancing_Script,
  JetBrains_Mono,
} from "next/font/google";
import { StateProvider } from "@/context/StateContext";
import { MotionConfig } from "framer-motion";

const headingFont = Fredoka({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

const scriptFont = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
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
      className={`${headingFont.variable} ${bodyFont.variable} ${scriptFont.variable} ${monoFont.variable}`}
    >
      <body className="font-sans min-h-screen bg-[#f3eedf] text-[#1d3a2b] antialiased selection:bg-emerald-800/15 selection:text-[#1d3a2b]">
        <StateProvider>{children}</StateProvider>
      </body>
    </html>
  );
}
 
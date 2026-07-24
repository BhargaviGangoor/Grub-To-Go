import "./globals.css";
import {
  Fredoka,
  Nunito,
  Dancing_Script,
  JetBrains_Mono,
} from "next/font/google";
import { StateProvider } from "@/context/StateContext";
import { MotionConfig } from "framer-motion";
import { AIAssistant } from "@/components/AIAssistant";

/**
 * Root Layout — mounts the AIAssistant globally.
 *
 * NEXT.JS CONCEPT: Root Layout
 * layout.tsx wraps EVERY page in the app.
 * Components mounted here appear on all pages.
 * This is how global UI (AI copilot, toast notifications, modals) works in Next.js App Router.
 *
 * WHY AIAssistant IS HERE (not in individual pages):
 * The floating AI copilot should be available everywhere — landing, generate, research, redeem.
 * Mounting it in the root layout means it loads once, persists across navigation,
 * and the conversation continues even as the user browses different pages.
 */

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
      suppressHydrationWarning
      className={`${headingFont.variable} ${bodyFont.variable} ${scriptFont.variable} ${monoFont.variable}`}
    >
      <body className="font-sans min-h-screen bg-[#f3eedf] text-[#1d3a2b] antialiased selection:bg-emerald-800/15 selection:text-[#1d3a2b]">
        <StateProvider>
          {children}
          {/* AI Copilot — globally available on every page */}
          <AIAssistant />
        </StateProvider>
      </body>
    </html>
  );
}
 
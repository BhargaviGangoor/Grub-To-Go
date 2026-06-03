import "./globals.css";

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
    <html lang="en">
      <body className="font-body bg-[#f4f1ea] text-[#1c2e24] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

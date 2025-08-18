import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../styles/globals.css";

const InterFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetSoft - Pet daycare software",
  description: "Take of people's pets responsibly with PetSoft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${InterFont.variable} min-h-screen bg-[#E5E8EC] text-sm text-zinc-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

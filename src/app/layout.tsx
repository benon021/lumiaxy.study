import type { Metadata } from "next";
import "./globals.css";
import SiderAgent from "@/components/SiderAgent";

export const metadata: Metadata = {
  title: "Lumiaxy.study",
  description:
    "Lumiaxy.study is an AI-powered platform for students to find past papers, study notes, and get instant help with their studies. Simplify your learning journey.",
  keywords: ["Lumiaxy.study", "past papers", "study notes", "AI tutor", "education platform", "Lumiaxy", "kenyan study", "kenyan education platform", "kenyan students"],
  openGraph: {
    title: "Lumiaxy.study",
    description: "Access past papers, study notes, and an AI tutor to excel in your exams.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-64x64.png" sizes="64x64" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body className="antialiased">
        {children}
        <SiderAgent />
      </body>
    </html>
  );
}

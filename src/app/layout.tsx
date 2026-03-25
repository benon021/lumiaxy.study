import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumiaxy — Your Ultimate Study Partner",
  description:
    "Lumiaxy.study is an AI-powered platform for students to find past papers, study notes, and get instant help with their studies. Simplify your learning journey.",
  keywords: ["Lumiaxy.study", "past papers", "study notes", "AI tutor", "education platform"],
  openGraph: {
    title: "Lumiaxy — Your Ultimate Study Partner",
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
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

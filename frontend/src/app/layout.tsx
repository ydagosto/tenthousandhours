import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "tenthousandhours",
  description: "Hone your craft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}

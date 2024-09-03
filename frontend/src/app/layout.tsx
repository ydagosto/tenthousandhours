import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NavBar";


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
      <body className="bg-gray-50 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}

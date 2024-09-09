import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/NavBar";
import type { Metadata } from "next";
import KoFiButton from "@/components/KoFiButton";

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
      <AuthProvider>
        <body className="bg-gray-50 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 flex flex-col overflow-auto">
            {children} 
          </main>
          <KoFiButton />
        </body>
      </AuthProvider>
    </html>
  );
}

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/NavBar";
import type { Metadata } from "next";
import KoFiButton from "@/components/KoFiButton";

export const metadata: Metadata = {
  title: "Track Practice Hours | Tenthousand Hours | tenthousandhours",
  description: "Log practice hours, monitor progress, and improve your skills with Tenthousand Hours. Track your journey toward mastering any craft using the 10,000-hour rule.",
  keywords: "track practice hours, 10000 hours rule, hone your craft, skill tracking, practice tracker, tenthousandhours, track daily time, daily practice log",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
            <head>
        {/* Meta tags */}
        <meta name="description" content="Log practice hours, monitor progress, and improve your skills with Tenthousand Hours. Track your journey toward mastering any craft using the 10,000-hour rule." />
        <meta name="keywords" content="track practice hours, 10000 hours rule, hone your craft, skill tracking, practice tracker, tenthousandhours, track daily time, daily practice log" />
        <meta name="author" content="tenthousand hours" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph tags for social media sharing */}
        <meta property="og:title" content="Track Practice Hours | Tenthousand Hours | tenthousandhours" />
        <meta property="og:description" content="Log practice hours, monitor progress, and improve your skills with Tenthousandhours." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tenthousandhours.net" />

        {/* Structured data for search engines */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Tenthousand Hours",
            "url": "https://tenthousandhours.net",
            "description": "Log practice hours, monitor progress, and improve your skills with Tenthousand Hours. Track your journey toward mastering any craft using the 10,000-hour rule.",
            "author": {
              "@type": "Organization",
              "name": "Tenthousand Hours"
            }
          })}
        </script>
      </head>
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

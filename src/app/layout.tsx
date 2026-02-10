import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sprout — eko plánovač, mapa a deník",
  description: "Private-first plánovač, společný deník, mapa míst a eko/vegan filtry."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <div className="min-h-dvh">
          {children}
        </div>
      </body>
    </html>
  );
}

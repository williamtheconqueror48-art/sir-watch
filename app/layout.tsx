import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  fallback: ["system-ui", "sans-serif"],
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  display: "swap",
});

const dataFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-data",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SIR-WATCH — Special Intensive Revision Tracker",
  description:
    "Structured public record of the Election Commission of India's Special Intensive Revision (SIR) of electoral rolls: state-by-state figures per source, the dissent timeline, notice archive, and case tracker. Descriptive facts only.",
  openGraph: {
    title: "SIR-WATCH — Special Intensive Revision Tracker",
    description:
      "A name-searchable public archive of SIR-affected electoral-roll records. Every row carries its source.",
    url: "https://sir-watch.vercel.app",
    siteName: "SIR-WATCH",
    images: [
      {
        url: "https://sir-watch.vercel.app/og-image.png",
        width: 2240,
        height: 1120,
        alt: "SIR-WATCH — Special Intensive Revision of Electoral Rolls",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIR-WATCH — Special Intensive Revision Tracker",
    description:
      "A name-searchable public archive of SIR-affected electoral-roll records. Every row carries its source.",
    images: ["https://sir-watch.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${bodyFont.variable} ${dataFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

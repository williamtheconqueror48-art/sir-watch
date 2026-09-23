import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIR-WATCH — Special Intensive Revision Tracker",
  description:
    "Structured public record of the Election Commission of India's Special Intensive Revision (SIR) of electoral rolls: state-by-state figures per source, the dissent timeline, notice archive, and case tracker. Descriptive facts only.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

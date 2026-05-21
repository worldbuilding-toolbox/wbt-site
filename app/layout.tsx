import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Worldbuilding Toolbox",
  description: "A quiet place to build worlds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

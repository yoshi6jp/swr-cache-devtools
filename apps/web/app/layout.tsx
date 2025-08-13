import type { Metadata } from "next";
import { SwrCacheDevTools } from "swr-cache-devtools";
import "./globals.css";

export const metadata: Metadata = {
  title: "SWR Cache DevTools Demo",
  description:
    "Explore various SWR usage patterns and cache behaviors in this interactive demo application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SwrCacheDevTools />
      </body>
    </html>
  );
}

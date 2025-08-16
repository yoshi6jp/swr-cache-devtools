import type { Metadata } from "next";
import { DevToolsController } from "../components/DevToolsController";
import "./globals.css";

export const metadata: Metadata = {
  title: "SWR Cache DevTools Demo",
  description:
    "Explore various SWR usage patterns and cache behaviors in this interactive demo application",
  icons: {
    icon: "/swr.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DevToolsController>{children}</DevToolsController>
      </body>
    </html>
  );
}

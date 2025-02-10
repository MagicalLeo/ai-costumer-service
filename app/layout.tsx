import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/markdown.css";
import AppContextProvider from "@/components/AppContext";
import EventBusContextProvider from "@/components/EventBusContext";

export const metadata: Metadata = {
  title: "Aivara",
  description: "Your next-gen customer support platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <AppContextProvider>
          <EventBusContextProvider>{children}</EventBusContextProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}

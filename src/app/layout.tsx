import type { Metadata } from "next";
import { Inter } from "next/font/google";

import BottomBar from "@/components/bottomBar/BottomBar";
import NoSSR from "@/components/common/NoSSR";
import LeftSideBar from "@/components/sideBar/LeftSideBar";
import RightSideBar from "@/components/sideBar/RightSideBar";
import SideBar from "@/components/sideBar/SideBar";
import AudioProvider from "@/lib/providers/AudioProvider";
import CurrentTimeProvider from "@/lib/providers/CurrentTimeProvider";
import PlaylistProvider from "@/lib/providers/PlaylistProvider";
import QueueProvider from "@/lib/providers/QueueProvider";
import UIConfigProvider from "@/lib/providers/UIConfigProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fusic | Music for everyone",
  description: "Music for everyone",
  icons: "/favicons/favicon.ico",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="h-screen select-none bg-black">
        <NoSSR>
          <PlaylistProvider>
            <QueueProvider>
              <AudioProvider>
                <CurrentTimeProvider>
                  <UIConfigProvider>
                    <div className="flex h-full flex-col">
                      <div className="flex flex-1 overflow-hidden p-2">
                        <SideBar name="left">
                          <LeftSideBar />
                        </SideBar>
                        <section className="main-section flex-1 rounded-lg bg-light-black">
                          {children}
                        </section>
                        <SideBar name="right">
                          <RightSideBar />
                        </SideBar>
                      </div>
                      <BottomBar />
                    </div>
                  </UIConfigProvider>
                </CurrentTimeProvider>
              </AudioProvider>
            </QueueProvider>
          </PlaylistProvider>
        </NoSSR>
      </body>
    </html>
  );
}

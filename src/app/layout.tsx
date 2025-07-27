import QueryProvider from "@/lib/query-provider";
import Sidebar from "@/components/sidebar";
import "@/styles/globals.css";

import "react-toastify/dist/ReactToastify.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "FE task QuarbonaAI",
  description: "fe task for QuarbonaAI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ToastContainer />
            <div className="h-screen flex max-h-screen overflow-hidden">
              <Sidebar />
              <div className="flex-1 overflow-auto">
                {children}
              </div>
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

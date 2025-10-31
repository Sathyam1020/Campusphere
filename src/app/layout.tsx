import RouteGuard from '@/components/auth/RouteGuard';
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Campusphere",
  description: "Connecting Students, Colleges & Recruiters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased bg-stone-100 dark:bg-stone-900`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RouteGuard />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

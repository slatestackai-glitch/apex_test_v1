import type { Metadata } from "next";
import { Hind } from "next/font/google";

import "@/app/globals.css";

const hind = Hind({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

export const metadata: Metadata = {
  title: "APEX Studio by Engati",
  description:
    "Turn website intent into qualified leads. Generate journey maps, qualification logic, implementation brief, analytics, and interactive demo modes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
  try {
    const theme = localStorage.getItem('apex-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  } catch(e) {}
` }} />
      </head>
      <body className={`${hind.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { BRAND_CONSTANTS } from "@/lib/brand";
import "./globals.css";

const { APP_NAME, APP_DESCRIPTION, APP_KEYWORDS, APP_AUTHOR, APP_AUTHOR_URL } =
  BRAND_CONSTANTS;

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS.join(", "),
  authors: [{ name: APP_AUTHOR, url: APP_AUTHOR_URL }],
  creator: APP_AUTHOR,
  publisher: APP_AUTHOR,
  robots: "index, follow",
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

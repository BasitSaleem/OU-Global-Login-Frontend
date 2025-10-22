import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";
import { Providers } from "@/providers";


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Owners Global Login System",
  description: "Global authentication system for business owners",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('ou-global-theme');
                  if (theme && ['light', 'dark', 'dark-ocean', 'dark-crimson'].includes(theme)) {
                    document.documentElement.classList.remove('light', 'dark', 'dark-ocean', 'dark-crimson');
                    document.documentElement.classList.add(theme);
                  } else {
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased`}
      >
        <Providers >
          <ErrorBoundary>{children}</ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}

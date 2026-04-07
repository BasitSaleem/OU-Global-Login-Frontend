import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";
import { Providers } from "@/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://osglobal.ownersjungle.com"),
  title: {
    default: "Owners Inventory",
    template: "%s | Owners Inventory"
  },
  description: "Global authentication and business management platform for Owners Inventory. Streamline your business operations with our suite of integrated products including Owners Inventory, Owners Jobs, Owners Marketplace, and more.",
  keywords: [
    "business management",
    "owners inventory",
    "global login",
    "business tools",
    "inventory management",
    "job management",
    "marketplace",
    "SaaS platform",
    "business dashboard",
    "organization management"
  ],
  authors: [
    {
      name: "Owners Inventory",
    }
  ],
  creator: "Owners Inventory",
  publisher: "Owners Inventory",
  applicationName: "Owners Inventory",

  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://osglobal.ownersjungle.com",
    siteName: "Owners Inventory",
    title: "Owners Inventory - Global Login & Authentication Platform",
    description: "Global authentication and business management platform for Owners Inventory. Streamline your business operations with our suite of integrated products.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Owners Global Logo",
      }
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Owners Inventory - Global Login & Authentication Platform",
    description: "Global authentication and business management platform for Owners Inventory. Streamline your business operations with our suite of integrated products.",
    creator: "@ownersinventory",
    images: ["/og-image.png"],
  },

  // App icons and favicons
  icons: {
    icon: [
      { url: "/OI_LOGO.svg", sizes: "26x26", type: "image/svg+xml" },
      { url: "/og-image.png", sizes: "16x16", type: "image/png" },
      { url: "/og-image.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/og-image.png", sizes: "180x180", type: "image/png" },
    ],
  },


  // Verification and other metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Viewport is set via viewport export below
  // manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
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

import Head from 'next/head';
import { NextSeo, NextSeoProps } from 'next-seo';
import { APP_CONFIG } from '@/constants';
import { SEOProps } from '@/types/common';

interface SEOComponentProps extends SEOProps {
  children?: React.ReactNode;
}

export function SEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  children
}: SEOComponentProps) {
  const fullTitle = title ? `${title} | ${APP_CONFIG.name}` : APP_CONFIG.name;
  const fullDescription = description || APP_CONFIG.description;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ownersglobal.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const defaultImage = `${siteUrl}/images/og-image.jpg`;
  const ogImage = image || defaultImage;

  const nextSeoProps: NextSeoProps = {
    title: fullTitle,
    description: fullDescription,
    canonical: fullUrl,
    openGraph: {
      type,
      locale: 'en_US',
      url: fullUrl,
      title: fullTitle,
      description: fullDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
          type: 'image/jpeg',
        },
      ],
      siteName: APP_CONFIG.name,
    },
    twitter: {
      handle: '@ownersglobal',
      site: '@ownersglobal',
      cardType: 'summary_large_image',
    },
    additionalMetaTags: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#2563eb',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: APP_CONFIG.name,
      },
      {
        name: 'application-name',
        content: APP_CONFIG.name,
      },
      {
        name: 'msapplication-TileColor',
        content: '#2563eb',
      },
      {
        name: 'msapplication-config',
        content: '/browserconfig.xml',
      },
      ...(keywords.length > 0 ? [{ name: 'keywords', content: keywords.join(', ') }] : []),
    ],
    additionalLinkTags: [
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-32x32.png',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-16x16.png',
        sizes: '16x16',
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
      {
        rel: 'mask-icon',
        href: '/safari-pinned-tab.svg',
        color: '#2563eb',
      },
    ],
  };

  return (
    <>
      <NextSeo {...nextSeoProps} />
      <Head>
        {/* Additional custom meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content={APP_CONFIG.author} />
        <meta name="copyright" content={APP_CONFIG.name} />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: APP_CONFIG.name,
              description: fullDescription,
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: APP_CONFIG.name,
              description: fullDescription,
              url: siteUrl,
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`,
                width: 512,
                height: 512,
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-XXX-XXX-XXXX',
                contactType: 'customer service',
                email: APP_CONFIG.supportEmail,
              },
              sameAs: [
                'https://twitter.com/ownersglobal',
                'https://linkedin.com/company/ownersglobal',
                'https://facebook.com/ownersglobal',
              ],
            }),
          }}
        />
        
        {children}
      </Head>
    </>
  );
}

// Pre-configured SEO components for common pages
export function LoginSEO() {
  return (
    <SEO
      title="Login"
      description="Sign in to your Owners Global account to access your dashboard and manage your business operations."
      keywords={['login', 'sign in', 'authentication', 'business']}
      url="/auth/login"
    />
  );
}

export function RegisterSEO() {
  return (
    <SEO
      title="Sign Up"
      description="Create your Owners Global account and start managing your business operations with our secure platform."
      keywords={['register', 'sign up', 'create account', 'business']}
      url="/auth/register"
    />
  );
}

export function DashboardSEO() {
  return (
    <SEO
      title="Dashboard"
      description="Manage your business operations from your centralized dashboard."
      keywords={['dashboard', 'management', 'business operations']}
      url="/dashboard"
    />
  );
}

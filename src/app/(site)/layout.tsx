import type { Metadata } from 'next'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getCategories, getSiteSettings } from '@/lib/content'
import { siteDefaults, siteUrl } from '@/lib/site'
import { urlForOpenGraphImage } from '@/sanity/image'

import '../globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings?.title ?? siteDefaults.title
  const description = settings?.description ?? siteDefaults.description
  const ogImage = urlForOpenGraphImage(settings?.ogImage)

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    applicationName: title,
    alternates: {
      canonical: '/',
      types: {
        'application/rss+xml': [{ url: '/feed.xml', title: `${title} — RSS` }],
      },
    },
    openGraph: {
      type: 'website',
      locale: siteDefaults.locale,
      url: siteUrl,
      siteName: title,
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    formatDetection: { telephone: false },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSiteSettings(), getCategories()])

  const title = settings?.title ?? siteDefaults.title
  const description = settings?.description ?? siteDefaults.description
  // Categoria sem post nao entra no menu: evita pagina vazia indexada.
  const visibleCategories = categories.filter((category) => category.postCount > 0)

  return (
    <html lang={siteDefaults.language}>
      <body>
        <div className="page">
          <a className="skip-link" href="#conteudo">
            Pular para o conteudo
          </a>
          <SiteHeader categories={visibleCategories} />
          <main id="conteudo">{children}</main>
          <SiteFooter title={title} description={description} categories={visibleCategories} />
        </div>
      </body>
    </html>
  )
}

import type { MetadataRoute } from 'next'

import { absoluteUrl, siteUrl } from '@/lib/site'

/** Gerado no build e servido como /robots.txt. */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // O Studio e area de edicao: nao deve ser rastreado nem indexado.
        disallow: ['/studio/', '/studio'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteUrl,
  }
}

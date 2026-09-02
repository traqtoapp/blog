import { getIndexablePosts, getSiteSettings } from '@/lib/content'
import { absoluteUrl, postPath, siteDefaults, siteUrl } from '@/lib/site'
import { escapeXml } from '@/lib/text'

/**
 * Feed RSS gerado no build e publicado como arquivo estatico em /feed.xml.
 * `force-static` e o que permite exportar uma rota de API num site sem servidor.
 */
export const dynamic = 'force-static'

export async function GET() {
  const [posts, settings] = await Promise.all([getIndexablePosts(), getSiteSettings()])

  const title = settings?.title ?? siteDefaults.title
  const description = settings?.description ?? siteDefaults.description
  const lastBuildDate = new Date(posts[0]?.publishedAt ?? Date.now()).toUTCString()

  const items = posts
    .map((post) => {
      const url = absoluteUrl(postPath(post.slug))
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(description)}</description>
    <language>pt-br</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}

import type { MetadataRoute } from 'next'

import { getCategories, getIndexablePosts } from '@/lib/content'
import { absoluteUrl, categoryPath, postPath } from '@/lib/site'

/** Gerado no build e servido como /sitemap.xml. */
export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getIndexablePosts(), getCategories()])

  const latest = posts[0]?.updatedAt ?? posts[0]?.publishedAt

  return [
    {
      url: absoluteUrl('/'),
      lastModified: latest ? new Date(latest) : new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...categories
      .filter((category) => category.postCount > 0)
      .map((category) => ({
        url: absoluteUrl(categoryPath(category.slug)),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
    ...posts.map((post) => ({
      url: absoluteUrl(postPath(post.slug)),
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}

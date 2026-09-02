import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/JsonLd'
import { PostCard } from '@/components/PostCard'
import { getCategory, getCategorySlugs, getPostsByCategory } from '@/lib/content'
import { absoluteUrl, categoryPath, postPath, siteDefaults, siteUrl } from '@/lib/site'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getCategorySlugs()

  // Ver comentario equivalente em /blog/[slug]: o build estatico precisa de ao
  // menos uma rota, mesmo com o CMS vazio.
  if (slugs.length === 0) return [{ slug: 'sem-categorias' }]

  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return {}

  const description =
    category.description ?? `Artigos sobre ${category.title.toLowerCase()} para corretores imobiliarios.`

  return {
    title: category.title,
    description,
    alternates: { canonical: absoluteUrl(categoryPath(category.slug)) },
    openGraph: {
      type: 'website',
      title: category.title,
      description,
      url: absoluteUrl(categoryPath(category.slug)),
      locale: siteDefaults.locale,
    },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const [category, posts] = await Promise.all([getCategory(slug), getPostsByCategory(slug)])
  if (!category) notFound()

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: category.title,
          description: category.description,
          url: absoluteUrl(categoryPath(category.slug)),
          inLanguage: siteDefaults.language,
          isPartOf: { '@type': 'Blog', name: siteDefaults.title, url: siteUrl },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: posts.map((post, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: absoluteUrl(postPath(post.slug)),
              name: post.title,
            })),
          },
        }}
      />

      <section className="hero">
        <div className="wrap">
          <Link className="back-link" href="/">
            ← Todos os artigos
          </Link>
          <h1>{category.title}</h1>
          {category.description && <p>{category.description}</p>}
        </div>
      </section>

      <section className="wrap section">
        {posts.length === 0 ? (
          <div className="empty-state">
            <h2>Ainda nao ha artigos nesta categoria</h2>
            <p>Assim que o primeiro post for publicado, ele aparece aqui.</p>
          </div>
        ) : (
          <ul className="post-grid">
            {posts.map((post) => (
              <li key={post._id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/JsonLd'
import { PostBody } from '@/components/PostBody'
import { PostCard } from '@/components/PostCard'
import { ProductCta } from '@/components/ProductCta'
import { SanityImage } from '@/components/SanityImage'
import { getPost, getPostSlugs, getRelatedPosts, getSiteSettings } from '@/lib/content'
import {
  absoluteUrl,
  alternatesFor,
  categoryPath,
  formatDate,
  postPath,
  siteDefaults,
  siteUrl,
  traqtoUrl,
} from '@/lib/site'
import { countWords, readingTimeInMinutes, truncate } from '@/lib/text'
import { urlForImage, urlForOpenGraphImage } from '@/sanity/image'

interface PageProps {
  params: Promise<{ slug: string }>
}

/** Exportacao estatica: todas as URLs precisam ser conhecidas no build. */
export const dynamicParams = false

/** Rota reservada usada apenas quando o CMS ainda nao tem nenhum post. */
const PLACEHOLDER_SLUG = 'sem-posts-publicados'

export async function generateStaticParams() {
  const slugs = await getPostSlugs()

  // `output: export` exige pelo menos uma rota gerada. Enquanto nao houver post
  // publicado, geramos um endereco reservado que responde com a pagina 404 —
  // ele nao entra no sitemap, no RSS nem em nenhum link do site.
  if (slugs.length === 0) return [{ slug: PLACEHOLDER_SLUG }]

  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const title = post.seo?.metaTitle ?? post.title
  const description = post.seo?.metaDescription ?? post.excerpt
  const url = absoluteUrl(postPath(post.slug))
  const settings = await getSiteSettings()
  // A capa e obrigatoria no schema, mas posts antigos (ou criados antes dessa
  // regra) podem nao ter — ai vale a imagem social padrao do blog.
  const ogImage = urlForOpenGraphImage(post.coverImage) ?? urlForOpenGraphImage(settings?.ogImage)

  return {
    title,
    description,
    alternates: alternatesFor(url, settings?.title ?? siteDefaults.title),
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      locale: siteDefaults.locale,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: post.categories?.map((category) => category.title),
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    // Espalhamento condicional de proposito: passar `robots: undefined` faria o
    // Next sobrescrever com nada as diretivas herdadas do layout
    // (max-image-preview:large e max-snippet:-1), justamente nas paginas de
    // artigo, que sao as que mais se beneficiam delas na busca.
    ...(post.seo?.noIndex ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const categorySlugs = post.categories?.map((category) => category.slug) ?? []
  const [related, settings] = await Promise.all([
    getRelatedPosts(slug, categorySlugs),
    getSiteSettings(),
  ])

  const url = absoluteUrl(postPath(post.slug))
  const ogImage = urlForOpenGraphImage(post.coverImage)
  const authorImage = urlForImage(post.author?.image, { width: 104 })
  const minutes = readingTimeInMinutes(post.body)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: truncate(post.title, 110),
          description: post.seo?.metaDescription ?? post.excerpt,
          image: ogImage ? [ogImage] : undefined,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt ?? post.publishedAt,
          inLanguage: siteDefaults.language,
          wordCount: countWords(post.body),
          articleSection: post.categories?.[0]?.title,
          keywords: post.categories?.map((category) => category.title).join(', ') || undefined,
          author: post.author?.name
            ? { '@type': 'Person', name: post.author.name, description: post.author.role }
            : { '@type': 'Organization', name: 'Traqto', url: traqtoUrl },
          publisher: {
            '@type': 'Organization',
            name: 'Traqto',
            url: traqtoUrl,
            logo: { '@type': 'ImageObject', url: absoluteUrl('/icon.svg') },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Blog', item: siteUrl },
            ...(post.categories?.[0]
              ? [
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: post.categories[0].title,
                    item: absoluteUrl(categoryPath(post.categories[0].slug)),
                  },
                ]
              : []),
            {
              '@type': 'ListItem',
              position: post.categories?.[0] ? 3 : 2,
              name: post.title,
              item: url,
            },
          ],
        }}
      />

      <article>
        <header className="wrap wrap--narrow article-header">
          <Link className="back-link" href="/">
            ← Todos os artigos
          </Link>

          <p className="meta">
            {post.categories?.map((category) => (
              <Link key={category.slug} href={categoryPath(category.slug)} className="chip">
                {category.title}
              </Link>
            ))}
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span className="meta__dot">{minutes} min de leitura</span>
          </p>

          <h1>{post.title}</h1>
          <p className="article-header__excerpt">{post.excerpt}</p>

          {post.author?.name && (
            <p className="meta">
              Por {post.author.name}
              {post.author.role && <span className="meta__dot">{post.author.role}</span>}
            </p>
          )}
        </header>

        {post.coverImage && (
          <div className="wrap wrap--narrow">
            <figure className="article-cover">
              <SanityImage
                image={post.coverImage}
                width={880}
                sizes="(max-width: 44rem) 100vw, 44rem"
                priority
              />
            </figure>
          </div>
        )}

        <div className="wrap wrap--narrow">
          {post.body && <PostBody value={post.body} />}

          <ProductCta link={post.traqtoLink} settings={settings} />

          {post.author?.name && (
            <div className="author-box">
              {authorImage && <img src={authorImage} alt="" width={52} height={52} />}
              <div>
                <p className="author-box__name">{post.author.name}</p>
                {post.author.role && <p className="author-box__meta">{post.author.role}</p>}
                {post.author.bio && <p className="author-box__meta">{post.author.bio}</p>}
              </div>
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="wrap section" aria-labelledby="relacionados">
          <h2 className="section__title" id="relacionados">
            Leia tambem
          </h2>
          <ul className="post-grid">
            {related.map((item) => (
              <li key={item._id}>
                <PostCard post={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

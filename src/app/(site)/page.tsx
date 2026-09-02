import Link from 'next/link'

import { JsonLd } from '@/components/JsonLd'
import { PostCard } from '@/components/PostCard'
import { ProductCta } from '@/components/ProductCta'
import { getCategories, getPosts, getSiteSettings } from '@/lib/content'
import { categoryPath, siteDefaults, siteUrl, traqtoUrl } from '@/lib/site'
import { isSanityConfigured } from '@/sanity/env'

export default async function HomePage() {
  const [posts, categories, settings] = await Promise.all([
    getPosts(),
    getCategories(),
    getSiteSettings(),
  ])

  const title = settings?.title ?? siteDefaults.title
  const description = settings?.description ?? siteDefaults.description
  const tagline = settings?.tagline ?? siteDefaults.tagline
  const [featured, ...rest] = posts
  const visibleCategories = categories.filter((category) => category.postCount > 0)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: title,
          description,
          url: siteUrl,
          inLanguage: siteDefaults.language,
          publisher: {
            '@type': 'Organization',
            name: 'Traqto',
            url: traqtoUrl,
          },
        }}
      />

      <section className="hero">
        <div className="wrap">
          <h1>{title}</h1>
          <p>{tagline}</p>
        </div>
      </section>

      {visibleCategories.length > 0 && (
        <nav className="wrap" style={{ paddingTop: '1.75rem' }} aria-label="Categorias">
          <ul className="chip-row">
            {visibleCategories.map((category) => (
              <li key={category.slug}>
                <Link href={categoryPath(category.slug)} className="chip">
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {posts.length === 0 ? (
        <section className="wrap section">
          <div className="empty-state">
            <h2>Nenhum post publicado ainda</h2>
            {isSanityConfigured ? (
              <p>
                Escreva o primeiro artigo em <Link href="/studio">/studio</Link> e clique em
                Publicar. O site e reconstruido automaticamente pelo pipeline do GitLab.
              </p>
            ) : (
              <p>
                O blog ainda nao esta ligado ao Sanity. Preencha{' '}
                <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> no arquivo <code>.env.local</code> (ou
                nas variaveis de CI/CD do GitLab) e refaca o build.
              </p>
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="wrap section" aria-labelledby="destaque">
            <h2 className="section__title" id="destaque">
              Em destaque
            </h2>
            <PostCard post={featured} featured />
          </section>

          {rest.length > 0 && (
            <section className="wrap section" aria-labelledby="ultimos">
              <h2 className="section__title" id="ultimos">
                Todos os artigos
              </h2>
              <ul className="post-grid">
                {rest.map((post) => (
                  <li key={post._id}>
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <div className="wrap" style={{ paddingBottom: '1rem' }}>
        <ProductCta settings={settings} />
      </div>
    </>
  )
}

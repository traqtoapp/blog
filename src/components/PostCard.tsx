import Link from 'next/link'

import { categoryPath, formatDate, postPath } from '@/lib/site'
import type { PostSummary } from '@/sanity/types'

import { SanityImage } from './SanityImage'

interface Props {
  post: PostSummary
  /** O primeiro post da home aparece maior, com a capa ao lado do texto. */
  featured?: boolean
}

export function PostCard({ post, featured = false }: Props) {
  const [category] = post.categories ?? []

  return (
    <article className={featured ? 'post-card post-card--featured' : 'post-card'}>
      {post.coverImage && (
        <Link href={postPath(post.slug)} className="post-card__media" tabIndex={-1} aria-hidden>
          <SanityImage
            image={post.coverImage}
            width={featured ? 720 : 420}
            sizes={featured ? '(max-width: 44rem) 100vw, 40rem' : '(max-width: 44rem) 100vw, 22rem'}
            priority={featured}
            alt=""
          />
        </Link>
      )}

      <div>
        <p className="meta">
          {category && (
            <Link href={categoryPath(category.slug)} className="chip">
              {category.title}
            </Link>
          )}
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>

        <h2 className="post-card__title" style={{ marginTop: '0.6rem' }}>
          <Link href={postPath(post.slug)}>{post.title}</Link>
        </h2>

        <p className="post-card__excerpt" style={{ marginTop: '0.5rem' }}>
          {post.excerpt}
        </p>
      </div>
    </article>
  )
}

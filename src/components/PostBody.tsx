import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'

import { postPath } from '@/lib/site'
import { slugify } from '@/lib/text'
import type { SanityImage as SanityImageType } from '@/sanity/types'

import { SanityImage } from './SanityImage'

/** Texto puro de um bloco, para gerar o id das ancoras dos titulos. */
function blockText(children: unknown): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(blockText).join('')
  if (children && typeof children === 'object' && 'props' in children) {
    return blockText((children as { props?: { children?: unknown } }).props?.children)
  }
  return ''
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 id={slugify(blockText(children))}>{children}</h2>,
    h3: ({ children }) => <h3 id={slugify(blockText(children))}>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },

  marks: {
    link: ({ children, value }) => {
      const href = String(value?.href ?? '')
      const external = /^https?:\/\//.test(href)
      const newTab = Boolean(value?.openInNewTab)

      return (
        <a
          href={href}
          target={newTab ? '_blank' : undefined}
          rel={newTab || external ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },

    // Link para outro post do blog: o slug ja vem resolvido pela consulta GROQ.
    internalLink: ({ children, value }) => {
      const slug = value?.slug as string | undefined
      if (!slug) return <>{children}</>
      return <Link href={postPath(slug)}>{children}</Link>
    },
  },

  types: {
    image: ({ value }) => {
      const image = value as SanityImageType
      if (!image?.asset) return null

      return (
        <figure>
          <SanityImage image={image} width={880} sizes="(max-width: 44rem) 100vw, 44rem" />
          {image.caption && <figcaption>{image.caption}</figcaption>}
        </figure>
      )
    },

    callout: ({ value }) => {
      const { tone, title, text } = value as { tone?: string; title?: string; text?: string }

      return (
        <aside className={tone === 'warning' ? 'callout callout--warning' : 'callout'}>
          {title && <p className="callout__title">{title}</p>}
          <p>{text}</p>
        </aside>
      )
    },
  },
}

export function PostBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="prose">
      <PortableText value={value} components={components} />
    </div>
  )
}

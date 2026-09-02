import type { PortableTextBlock } from '@portabletext/react'

/** Imagem vinda do Sanity, ja com os campos extras do schema. */
export interface SanityImage {
  _type?: string
  asset?: { _ref: string; _type?: string }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
  caption?: string
}

export interface CategoryRef {
  title: string
  slug: string
}

export interface Category extends CategoryRef {
  _id: string
  description?: string
}

export interface Author {
  name: string
  role?: string
  bio?: string
  slug?: string
  image?: SanityImage
}

export interface TraqtoLink {
  feature: string
  description: string
  url: string
  ctaText: string
}

export interface PostSeo {
  metaTitle?: string
  metaDescription?: string
  keyphrase?: string
  noIndex?: boolean
}

/** Campos usados nas listagens (home, categoria, relacionados). */
export interface PostSummary {
  _id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  updatedAt?: string
  coverImage?: SanityImage
  categories?: CategoryRef[]
  author?: Pick<Author, 'name' | 'role'>
}

/** Post completo, usado na pagina do post. */
export interface Post extends PostSummary {
  body?: PortableTextBlock[]
  author?: Author
  traqtoLink?: TraqtoLink
  seo?: PostSeo
}

export interface SiteSettings {
  title?: string
  description?: string
  tagline?: string
  ogImage?: SanityImage
  ctaTitle?: string
  ctaText?: string
  ctaButtonLabel?: string
}

/** Entrada minima usada por sitemap.xml e feed.xml. */
export interface PostFeedItem {
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  updatedAt?: string
}

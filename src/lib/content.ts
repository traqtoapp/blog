import { sanityFetch } from '@/sanity/client'
import {
  categoriesQuery,
  categoryBySlugQuery,
  categorySlugsQuery,
  indexablePostsQuery,
  postBySlugQuery,
  postSlugsQuery,
  postsByCategoryQuery,
  postsQuery,
  relatedPostsQuery,
  siteSettingsQuery,
} from '@/sanity/queries'
import type { Category, Post, PostFeedItem, PostSummary, SiteSettings } from '@/sanity/types'

/**
 * Camada de acesso ao conteudo. Toda pagina do site passa por aqui, o que
 * mantem as consultas em um lugar so e garante um fallback vazio quando o
 * Sanity ainda nao esta configurado.
 */

export function getPosts(): Promise<PostSummary[]> {
  return sanityFetch<PostSummary[]>(postsQuery, {}, [])
}

export function getPostSlugs(): Promise<string[]> {
  return sanityFetch<string[]>(postSlugsQuery, {}, [])
}

export function getPost(slug: string): Promise<Post | null> {
  return sanityFetch<Post | null>(postBySlugQuery, { slug }, null)
}

export function getRelatedPosts(slug: string, categories: string[]): Promise<PostSummary[]> {
  return sanityFetch<PostSummary[]>(relatedPostsQuery, { slug, categories }, [])
}

export function getCategories(): Promise<(Category & { postCount: number })[]> {
  return sanityFetch<(Category & { postCount: number })[]>(categoriesQuery, {}, [])
}

export function getCategorySlugs(): Promise<string[]> {
  return sanityFetch<string[]>(categorySlugsQuery, {}, [])
}

export function getCategory(slug: string): Promise<Category | null> {
  return sanityFetch<Category | null>(categoryBySlugQuery, { slug }, null)
}

export function getPostsByCategory(slug: string): Promise<PostSummary[]> {
  return sanityFetch<PostSummary[]>(postsByCategoryQuery, { slug }, [])
}

/** Posts que entram no sitemap.xml e no feed RSS. */
export function getIndexablePosts(): Promise<PostFeedItem[]> {
  return sanityFetch<PostFeedItem[]>(indexablePostsQuery, {}, [])
}

export function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityFetch<SiteSettings | null>(siteSettingsQuery, {}, null)
}

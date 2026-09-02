import { defineQuery } from 'next-sanity'

/**
 * Consultas GROQ do blog. Todas rodam em build time: o site e estatico e cada
 * publicacao no Sanity dispara um rebuild completo via webhook.
 */

const POST_SUMMARY_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  updatedAt,
  coverImage,
  "categories": categories[]->{title, "slug": slug.current},
  author->{name, role}
`

/** Todos os posts, do mais novo para o mais antigo. */
export const postsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    ${POST_SUMMARY_FIELDS}
  }
`)

/** Apenas os slugs — usado por generateStaticParams. */
export const postSlugsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)].slug.current
`)

/** Post completo pela URL. */
export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${POST_SUMMARY_FIELDS},
    // Resolve o slug dos links internos para outros posts do blog.
    body[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => { "slug": @.reference->slug.current }
      }
    },
    author->{name, role, bio, image, "slug": slug.current},
    traqtoLink,
    seo
  }
`)

/**
 * Ate tres posts relacionados: primeiro os que dividem categoria com o atual,
 * completando com os mais recentes quando faltar.
 */
export const relatedPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && slug.current != $slug]
  | score(count((categories[]->slug.current)[@ in $categories]) > 0)
  | order(_score desc, publishedAt desc)[0...3] {
    ${POST_SUMMARY_FIELDS}
  }
`)

/** Categorias com contagem de posts (categorias vazias ficam de fora do menu). */
export const categoriesQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`)

export const categoryBySlugQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description
  }
`)

export const categorySlugsQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)].slug.current
`)

export const postsByCategoryQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && $slug in categories[]->slug.current]
  | order(publishedAt desc) {
    ${POST_SUMMARY_FIELDS}
  }
`)

/** Posts indexaveis — alimenta sitemap.xml e feed.xml. */
export const indexablePostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && seo.noIndex != true]
  | order(publishedAt desc) {
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    updatedAt
  }
`)

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    title,
    description,
    tagline,
    ogImage,
    ctaTitle,
    ctaText,
    ctaButtonLabel
  }
`)

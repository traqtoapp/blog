/**
 * Configuracao fixa do site. O que muda com frequencia (titulo, chamadas)
 * vive no Sanity, em "Configuracoes do blog"; aqui ficam so os valores que o
 * build precisa conhecer antes de falar com o CMS.
 */

function normalizeUrl(value: string | undefined, fallback: string): string {
  const url = (value ?? '').trim() || fallback
  return url.replace(/\/+$/, '')
}

export const siteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL, 'https://blog.traqto.com')

export const traqtoUrl = normalizeUrl(process.env.NEXT_PUBLIC_TRAQTO_URL, 'https://traqto.com')

export const siteDefaults = {
  title: 'Blog do Traqto',
  description:
    'Conteudo pratico para corretores imobiliarios: proposta de compra, due diligence, negociacao e prazos de escritura.',
  tagline: 'Como conduzir uma negociacao imobiliaria do primeiro contato a escritura.',
  locale: 'pt_BR',
  language: 'pt-BR',
} as const

/** Monta uma URL absoluta a partir de um caminho interno. */
export function absoluteUrl(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${siteUrl}${normalized}`
}

/** Endereco publico de um post. */
export function postPath(slug: string): string {
  return `/blog/${slug}/`
}

/** Endereco publico de uma categoria. */
export function categoryPath(slug: string): string {
  return `/categoria/${slug}/`
}

export function formatDate(value: string | undefined | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(date)
}

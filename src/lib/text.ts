import { toPlainText, type PortableTextBlock } from '@portabletext/react'

/** Transforma um texto em identificador de ancora (usado nos H2/H3 do post). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

/** Numero de palavras do corpo do post — alimenta o tempo de leitura. */
export function countWords(body: PortableTextBlock[] | undefined): number {
  if (!body?.length) return 0
  return toPlainText(body).split(/\s+/).filter(Boolean).length
}

/** Tempo de leitura arredondado, a 220 palavras por minuto. */
export function readingTimeInMinutes(body: PortableTextBlock[] | undefined): number {
  return Math.max(1, Math.round(countWords(body) / 220))
}

/** Corta um texto em `limit` caracteres sem quebrar palavra. */
export function truncate(input: string, limit: number): string {
  const clean = input.replace(/\s+/g, ' ').trim()
  if (clean.length <= limit) return clean
  return `${clean.slice(0, clean.lastIndexOf(' ', limit - 1))}…`
}

/**
 * Escapa texto para uso dentro de XML (sitemap e feed RSS).
 *
 * Aceita nulo de proposito: um post sem resumo (importado por NDJSON, por
 * exemplo) derrubaria o build inteiro com TypeError em vez de gerar o site.
 */
export function escapeXml(input: string | null | undefined): string {
  return (input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

import { createClient, type SanityClient } from 'next-sanity'

import { apiVersion, dataset, isSanityConfigured, projectId } from './env'

/**
 * Token de leitura. So e necessario se o dataset for privado — com dataset
 * publico (o padrao para um blog) o build le sem autenticacao nenhuma.
 * Fica apenas no servidor de build: nunca vai para o HTML gerado.
 */
const readToken = process.env.SANITY_API_READ_TOKEN?.trim() || undefined

/**
 * Cliente de leitura usado durante o build estatico.
 *
 * `useCdn` fica ligado no dataset publico porque toda leitura acontece em build
 * time: o CDN do Sanity e gratuito, mais rapido e nao consome cota da API. Como
 * cada publicacao dispara um rebuild completo via webhook, nao existe risco de
 * servir cache velho. Com token (dataset privado) o CDN e desligado, que e o
 * comportamento recomendado pelo Sanity para leituras autenticadas.
 */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: !readToken,
      token: readToken,
      perspective: 'published',
      stega: false,
    })
  : null

/**
 * Executa uma consulta GROQ devolvendo `fallback` quando o Sanity ainda nao
 * esta configurado. Mantem o build verde num projeto recem-clonado.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  if (!client) return fallback

  try {
    return await client.fetch<T>(query, params)
  } catch (error) {
    // Um erro de rede no build nao deve derrubar o pipeline inteiro; o job
    // registra o problema e o site sai com o conteudo que conseguiu buscar.
    console.error('[sanity] falha ao consultar o Content Lake:', error)
    return fallback
  }
}

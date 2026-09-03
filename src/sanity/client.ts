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
 * Executa uma consulta GROQ.
 *
 * Sem Sanity configurado devolve `fallback` — e o que mantem o build verde num
 * projeto recem-clonado, antes de o CMS existir.
 *
 * Com Sanity configurado, um erro de consulta **derruba o build de proposito**.
 * Engolir a falha aqui seria pior: o pipeline terminaria verde e publicaria um
 * site vazio por cima do atual, apagando todos os posts do ar por causa de uma
 * instabilidade passageira. Falhando, o deploy anterior continua no ar e basta
 * rodar o pipeline de novo.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  if (!client) return fallback

  return client.fetch<T>(query, params)
}

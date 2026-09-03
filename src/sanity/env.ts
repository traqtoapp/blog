/**
 * Leitura centralizada da configuracao do Sanity.
 *
 * O blog precisa buildar mesmo antes de o Sanity estar configurado (por exemplo
 * no primeiro pipeline, antes de as variaveis existirem no GitLab). Por isso
 * nada aqui lanca excecao: quando falta o projectId, `isSanityConfigured` fica
 * falso e as consultas devolvem listas vazias em vez de quebrar o build.
 */

/**
 * Projeto Sanity do blog do Traqto. Fica como padrao no codigo (o projectId e
 * publico — ele vai para o JavaScript do Studio de qualquer jeito) para que
 * `npm run dev` e o pipeline funcionem sem depender de ninguem lembrar de
 * cadastrar a variavel. Para replicar este blog em outra empresa, troque aqui
 * ou defina NEXT_PUBLIC_SANITY_PROJECT_ID no ambiente.
 */
const DEFAULT_PROJECT_ID = 'p7j9d06t'

export const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID).trim()
export const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production').trim()
export const apiVersion = (process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-01-01').trim()

/** O projectId do Sanity e sempre alfanumerico minusculo (ex.: "a1b2c3d4"). */
const PROJECT_ID_PATTERN = /^[a-z0-9]+$/

export const isSanityConfigured = PROJECT_ID_PATTERN.test(projectId)

if (!isSanityConfigured && process.env.NODE_ENV !== 'test') {
  console.warn(
    `[sanity] projectId invalido ("${projectId}") — o site sera gerado sem conteudo. ` +
      'Confira NEXT_PUBLIC_SANITY_PROJECT_ID no .env.local (dev) ou nas variaveis de CI/CD (GitLab).',
  )
}

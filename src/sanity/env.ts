/**
 * Leitura centralizada da configuracao do Sanity.
 *
 * O blog precisa buildar mesmo antes de o Sanity estar configurado (por exemplo
 * no primeiro pipeline, antes de as variaveis existirem no GitLab). Por isso
 * nada aqui lanca excecao: quando falta o projectId, `isSanityConfigured` fica
 * falso e as consultas devolvem listas vazias em vez de quebrar o build.
 */

export const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '').trim()
export const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production').trim()
export const apiVersion = (process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-01-01').trim()

/** O projectId do Sanity e sempre alfanumerico minusculo (ex.: "a1b2c3d4"). */
const PROJECT_ID_PATTERN = /^[a-z0-9]+$/

export const isSanityConfigured = PROJECT_ID_PATTERN.test(projectId)

if (!isSanityConfigured && process.env.NODE_ENV !== 'test') {
  console.warn(
    '[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID ausente ou invalido — ' +
      'o site sera gerado sem conteudo. Preencha .env.local (dev) ou as variaveis de CI/CD (GitLab).',
  )
}

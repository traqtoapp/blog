import { StudioClient } from './StudioClient'

/**
 * Sanity Studio embutido em /studio.
 *
 * A pagina e exportada estatica e o Studio roda inteiro no navegador, falando
 * direto com a API do Sanity — por isso funciona no GitLab Pages, que so serve
 * arquivos. Publicar por aqui dispara o webhook que reconstroi o site.
 */
export const dynamic = 'force-static'

export function generateStaticParams() {
  return [{ tool: [] as string[] }]
}

export default function StudioPage() {
  return <StudioClient />
}

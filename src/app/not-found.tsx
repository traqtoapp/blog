import { NotFoundContent } from '@/components/NotFoundContent'
import { siteDefaults } from '@/lib/site'

import './globals.css'

export const metadata = {
  title: 'Pagina nao encontrada',
  robots: { index: false, follow: true },
}

/**
 * 404 global. E esta rota que vira `out/404.html` — o arquivo que o GitLab
 * Pages devolve em qualquer endereco que nao existe.
 *
 * Precisa trazer <html> e <body> proprios: o projeto tem dois layouts raiz,
 * (site) e (studio), e nenhum dos dois envolve esta rota. Sem este arquivo, o
 * Next exporta o 404 padrao dele, em ingles e sem o estilo do blog.
 */
export default function NotFound() {
  return (
    <html lang={siteDefaults.language}>
      <body>
        <div className="page">
          <main className="wrap section">
            <NotFoundContent />
          </main>
        </div>
      </body>
    </html>
  )
}

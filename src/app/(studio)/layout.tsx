import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio — Blog do Traqto',
  // A area de edicao nunca deve aparecer em busca.
  robots: { index: false, follow: false },
}

/**
 * Layout raiz proprio do Studio: sem cabecalho, rodape ou CSS do blog — o
 * Sanity Studio ocupa a tela inteira e traz o proprio estilo.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}

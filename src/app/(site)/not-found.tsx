import { NotFoundContent } from '@/components/NotFoundContent'

export const metadata = {
  title: 'Pagina nao encontrada',
  robots: { index: false, follow: true },
}

/**
 * 404 de dentro do site — usado quando notFound() e chamado numa pagina do
 * grupo (site), como a rota reservada gerada enquanto o CMS esta vazio. Aqui o
 * layout do blog (cabecalho e rodape) envolve a pagina.
 */
export default function SiteNotFound() {
  return (
    <section className="wrap section">
      <NotFoundContent />
    </section>
  )
}

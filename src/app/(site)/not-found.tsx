import Link from 'next/link'

export const metadata = {
  title: 'Pagina nao encontrada',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section className="wrap section">
      <div className="empty-state">
        <h2>Pagina nao encontrada</h2>
        <p>O endereco acessado nao existe ou o artigo mudou de lugar.</p>
        <p style={{ marginTop: '1.5rem' }}>
          <Link className="button" href="/">
            Voltar para a home
          </Link>
        </p>
      </div>
    </section>
  )
}

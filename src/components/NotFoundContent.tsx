import Link from 'next/link'

/**
 * Miolo da pagina 404, compartilhado por duas rotas diferentes:
 *
 * - src/app/not-found.tsx — o 404 global, exportado como out/404.html, que e o
 *   arquivo que o GitLab Pages serve em qualquer endereco inexistente;
 * - src/app/(site)/not-found.tsx — usado quando notFound() e chamado dentro do
 *   site, ai sim com cabecalho e rodape.
 */
export function NotFoundContent() {
  return (
    <div className="empty-state">
      <h1>Pagina nao encontrada</h1>
      <p>O endereco acessado nao existe ou o artigo mudou de lugar.</p>
      <p style={{ marginTop: '1.5rem' }}>
        <Link className="button" href="/">
          Voltar para a home
        </Link>
      </p>
    </div>
  )
}

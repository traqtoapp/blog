/**
 * Injeta dados estruturados (schema.org) na pagina.
 *
 * O Google usa esse JSON-LD para entender autor, data e tipo do conteudo — e
 * para exibir o post com data e trilha de navegacao nos resultados de busca.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // O conteudo e gerado no build a partir do CMS, nunca de entrada do visitante.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

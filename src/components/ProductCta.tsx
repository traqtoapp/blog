import { traqtoUrl } from '@/lib/site'
import type { SiteSettings, TraqtoLink } from '@/sanity/types'

interface Props {
  /** Ligacao especifica do post com uma funcionalidade do Traqto. */
  link?: TraqtoLink | null
  /** Textos padrao vindos de "Configuracoes do blog", usados como reserva. */
  settings?: SiteSettings | null
}

/**
 * Bloco que liga o conteudo ao produto.
 *
 * E o unico ponto de conversao do blog: cada post aponta para a etapa do fluxo
 * do Traqto que resolve o problema descrito no texto.
 */
export function ProductCta({ link, settings }: Props) {
  const title = link?.feature ?? settings?.ctaTitle ?? 'Feche negocios sem perder o fio da meada'
  const text =
    link?.description ??
    settings?.ctaText ??
    'O Traqto organiza proposta, due diligence e fechamento em um lugar so.'
  const href = link?.url ?? traqtoUrl
  const label = link?.ctaText ?? settings?.ctaButtonLabel ?? 'Conhecer o Traqto'

  return (
    <aside className="product-cta">
      <p className="product-cta__eyebrow">No Traqto</p>
      <h2>{title}</h2>
      <p>{text}</p>
      <a className="button" href={href}>
        {label}
      </a>
    </aside>
  )
}

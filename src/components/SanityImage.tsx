import { imageDimensions, urlForImage } from '@/sanity/image'
import type { SanityImage as SanityImageType } from '@/sanity/types'

/**
 * Multiplos da largura de exibicao oferecidos ao navegador. Cobrem telas
 * comuns (1x), retina (2x) e os casos intermediarios.
 */
const FATORES = [0.5, 1, 1.5, 2]

interface Props {
  image: SanityImageType | undefined | null
  /** Largura maxima em que a imagem sera exibida, em pixels CSS. */
  width: number
  /** Quanto a imagem ocupa da tela, por faixa de viewport (atributo `sizes`). */
  sizes?: string
  alt?: string
  className?: string
  priority?: boolean
}

/**
 * <img> simples apontando para o CDN do Sanity.
 *
 * O site e exportado estatico, entao nao existe otimizador de imagem do Next em
 * runtime: quem redimensiona e converte para WebP/AVIF e o proprio CDN do
 * Sanity, via parametros na URL.
 *
 * O srcset usa descritores de largura (`w`), nao de densidade (`1x`/`2x`):
 * pela especificacao do HTML, com descritores de densidade o navegador ignora
 * o `sizes` e escolhe so pela densidade da tela — um celular retina baixaria a
 * versao 2x mesmo exibindo a imagem em meia largura.
 */
export function SanityImage({ image, width, sizes, alt, className, priority = false }: Props) {
  const src = urlForImage(image, { width })
  if (!src) return null

  const candidatos = FATORES.map((fator) => Math.round(width * fator))
    .map((largura) => {
      const url = urlForImage(image, { width: largura })
      return url ? `${url} ${largura}w` : null
    })
    .filter((entrada): entrada is string => entrada !== null)

  const dimensions = imageDimensions(image)
  const height = dimensions ? Math.round((width * dimensions.height) / dimensions.width) : undefined

  return (
    <img
      src={src}
      srcSet={candidatos.length > 1 ? candidatos.join(', ') : undefined}
      // Sem `sizes`, o navegador assume 100vw e superestima a largura
      // necessaria; para imagem de largura fixa, o proprio valor e a resposta.
      sizes={sizes ?? `${width}px`}
      alt={alt ?? image?.alt ?? ''}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
    />
  )
}

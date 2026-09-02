import { imageDimensions, urlForImage } from '@/sanity/image'
import type { SanityImage as SanityImageType } from '@/sanity/types'

interface Props {
  image: SanityImageType | undefined | null
  /** Largura maxima em que a imagem sera exibida, em pixels CSS. */
  width: number
  /** Valor do atributo `sizes`, para o navegador escolher a densidade certa. */
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
 * Sanity, via parametros na URL. O srcset em 1x/2x cobre telas retina.
 */
export function SanityImage({ image, width, sizes, alt, className, priority = false }: Props) {
  const src = urlForImage(image, { width })
  if (!src) return null

  const retina = urlForImage(image, { width: width * 2 })
  const dimensions = imageDimensions(image)
  const height = dimensions ? Math.round((width * dimensions.height) / dimensions.width) : undefined

  return (
    <img
      src={src}
      srcSet={retina ? `${src} 1x, ${retina} 2x` : undefined}
      sizes={sizes}
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

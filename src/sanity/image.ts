import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

import { dataset, isSanityConfigured, projectId } from './env'
import type { SanityImage } from './types'

const builder = isSanityConfigured ? createImageUrlBuilder({ projectId, dataset }) : null

/**
 * Monta a URL de uma imagem do Sanity ja redimensionada e convertida.
 *
 * Como o site e exportado estatico (sem otimizador de imagem do Next), quem faz
 * esse trabalho e o CDN do Sanity — gratuito e devolve WebP/AVIF conforme o
 * navegador.
 */
export function urlForImage(
  source: SanityImage | undefined | null,
  options: { width?: number; height?: number; quality?: number } = {},
): string | null {
  if (!builder || !source?.asset) return null

  let image = builder.image(source as SanityImageSource).auto('format').fit('max')

  if (options.width) image = image.width(options.width)
  if (options.height) image = image.height(options.height)

  return image.quality(options.quality ?? 80).url()
}

/** Imagem social (Open Graph / Twitter), no formato 1200x630 recomendado. */
export function urlForOpenGraphImage(source: SanityImage | undefined | null): string | null {
  if (!builder || !source?.asset) return null

  return builder
    .image(source as SanityImageSource)
    .width(1200)
    .height(630)
    .fit('crop')
    .auto('format')
    .quality(85)
    .url()
}

/**
 * Extrai largura e altura do proprio `_ref` do asset — o Sanity codifica as
 * dimensoes no id (ex.: `image-abc123-1600x900-jpg`). Serve para preencher
 * width/height no HTML e evitar deslocamento de layout durante o carregamento.
 */
export function imageDimensions(
  source: SanityImage | undefined | null,
): { width: number; height: number } | null {
  const ref = source?.asset?._ref
  if (!ref) return null

  const match = /-(\d+)x(\d+)-[a-z]+$/.exec(ref)
  if (!match) return null

  return { width: Number(match[1]), height: Number(match[2]) }
}

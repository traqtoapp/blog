import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * O GitLab Pages serve apenas arquivos estaticos (nao roda Node),
   * entao o site inteiro e pre-renderizado para HTML em `out/`.
   */
  output: 'export',

  /**
   * Cada rota vira `rota/index.html`, que e o formato que o GitLab Pages
   * resolve sem precisar de configuracao extra de servidor.
   */
  trailingSlash: true,

  /**
   * Sem servidor Node nao ha otimizacao de imagem em runtime.
   * As imagens ja saem redimensionadas do CDN do Sanity (ver src/sanity/image.ts).
   */
  images: {
    unoptimized: true,
  },

  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig

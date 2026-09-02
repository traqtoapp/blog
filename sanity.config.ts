import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schemaTypes } from './src/sanity/schemas'
import { structure } from './src/sanity/structure'

/**
 * Configuracao do Sanity Studio embutido em /studio.
 *
 * Publicar por aqui (pelo navegador) e o unico passo necessario para o post ir
 * ao ar: o webhook do Sanity dispara o pipeline do GitLab, que refaz o site.
 */
export default defineConfig({
  name: 'traqto-blog',
  title: 'Blog do Traqto',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    // Vision permite testar consultas GROQ dentro do proprio Studio.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    // O singleton de configuracoes nao deve aparecer no menu "criar novo".
    templates: (prev) => prev.filter((template) => template.schemaType !== 'siteSettings'),
  },
  document: {
    actions: (prev, { schemaType }) =>
      schemaType === 'siteSettings'
        ? prev.filter(({ action }) => action !== 'unpublish' && action !== 'duplicate' && action !== 'delete')
        : prev,
  },
})

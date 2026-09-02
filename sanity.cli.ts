import { defineCliConfig } from 'sanity/cli'

import { dataset, projectId } from './src/sanity/env'

/**
 * Usado apenas pela CLI do Sanity — no pipeline agendado de backup
 * (`sanity dataset export`) e numa eventual restauracao (`dataset import`).
 * O dia a dia de publicacao acontece pelo Studio em /studio, no navegador.
 */
export default defineCliConfig({
  api: { projectId, dataset },
})

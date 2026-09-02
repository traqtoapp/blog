'use client'

import dynamic from 'next/dynamic'

import { isSanityConfigured, projectId } from '@/sanity/env'
import config from '~/sanity.config'

/**
 * O Studio e pesado e depende de APIs de navegador, entao e carregado apenas no
 * cliente (`ssr: false`). Sem isso o build estatico tentaria renderizar o editor
 * inteiro no servidor.
 */
const NextStudio = dynamic(() => import('next-sanity/studio').then((mod) => mod.NextStudio), {
  ssr: false,
  loading: () => <StudioMessage title="Carregando o Studio…" />,
})

function StudioMessage({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100dvh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        color: '#33455c',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '32rem' }}>
        <h1 style={{ fontSize: '1.25rem', color: '#0f1c2e' }}>{title}</h1>
        {children}
      </div>
    </div>
  )
}

export function StudioClient() {
  if (!isSanityConfigured) {
    return (
      <StudioMessage title="Studio nao configurado">
        <p>
          Defina <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> e{' '}
          <code>NEXT_PUBLIC_SANITY_DATASET</code> nas variaveis de ambiente e refaca o build.
          {projectId ? ` Valor atual do projectId: "${projectId}".` : ''}
        </p>
      </StudioMessage>
    )
  }

  return <NextStudio config={config} />
}

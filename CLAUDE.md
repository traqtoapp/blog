# Blog do Traqto — contexto do projeto

Blog estatico em `blog.traqto.com`, para gerar trafego organico e levar
corretores imobiliarios ao produto. Conteudo no Sanity, site em Next.js
exportado estatico, hospedado no GitLab Pages.

Documentacao completa: `README.md`, `docs/configuracao.md`, `docs/editorial.md`.

## Enderecos e identificadores

| O que | Valor |
| ----- | ----- |
| Repositorio (origem) | https://github.com/traqtoapp/blog — branch `main` |
| Repositorio (deploy) | https://gitlab.com/traqtoapp/blog — privado, roda o pipeline |
| Sanity projectId | `p7j9d06t` (dataset `production`) |
| Sanity organization | `okq0olpli` |
| Dominio final | https://blog.traqto.com |
| Endereco provisorio | dominio unico do GitLab Pages — muda a cada recriacao do projeto; ver **Deploy > Pages** ou **Deploy > Environments** |

## Pastas de trabalho

- Maquina do usuario: `~/Documents/traqto-blog`
- Sessao online (Claude Code): `/home/user/blog`

As duas sao clones do mesmo repositorio do GitHub.

## Fluxo de publicacao

```
Studio (/studio) -> webhook do Sanity -> trigger no GitLab -> job `pages` -> site no ar
```

Publicar um post e so escrever no Studio e clicar em **Publish**. Nao precisa de
terminal nem do computador do usuario ligado.

Ja o **codigo** segue outro caminho: os commits vao para o GitHub (unico remoto
que esta sessao consegue acessar) e o usuario replica para o GitLab com
`git pull origin main && git push gitlab main`. Sem esse push, o site nao muda.

## Limites desta sessao online

A politica de rede do ambiente bloqueia quase tudo. Alcanca `gitlab.com`,
`github.com` e o registro do npm. **Bloqueia** (403, `x-deny-reason: host_not_allowed`):

- `*.gitlab.io` — o site publicado
- `blog.traqto.com` — o dominio proprio
- `*.sanity.io` — a API do CMS
- DNS por HTTPS (Cloudflare e Google)

Consequencia pratica: **nao da para testar o site publicado nem consultar o
Sanity daqui.** Build local e inspecao do HTML gerado funcionam normalmente. Para
destravar, o usuario precisa adicionar esses hosts ao *network egress* do
ambiente.

O repositorio do GitLab e privado e esta sessao nao tem credencial para ele.

## Comandos

```bash
npm run dev        # site em localhost:3000, Studio em /studio
npm run build      # exporta o site estatico para out/
npm run typecheck  # checagem de tipos
```

Para buildar aqui sem acesso ao Sanity (o build falha de proposito quando a
consulta ao CMS quebra, para nao publicar um site vazio por cima do atual):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=- npx next build
```

## Decisoes que nao devem ser reabertas

- **GitLab Pages, nao Vercel nem GitHub Pages** — o plano gratuito do GitLab
  permite uso comercial de forma explicita.
- **Uma conta GitLab por empresa, projetos no namespace pessoal, sem grupo** —
  socios diferentes em empresas diferentes nao devem compartilhar infraestrutura.
- **Sem WordPress** (pedido explicito) e sem servidor pago.
- **Publicacao 100% pelo navegador** — nada pode depender do computador do dono.
- **Sintaxe atual do GitLab Pages** (`pages: publish: out`). A forma antiga
  (job chamado `pages` publicando `public/`) faz o pipeline falhar com erro de
  configuracao e nenhum job criado.
- **Dominio unico do GitLab Pages ligado.** Sem ele o site fica num subdiretorio
  e quebra, porque o export gera caminhos absolutos.

## Estado atual

Feito: codigo completo e revisado (duas rodadas de revisao adversarial, 11
achados confirmados e corrigidos), pipeline verde, site publicado no endereco
provisorio, Studio registrado no Sanity, categoria "Due diligence" publicada.

Pendente: publicar o primeiro post (material pronto em `content/primeiro-post/`),
verificar o dominio `blog.traqto.com` no GitLab, criar o webhook do Sanity
(passo 5 de `docs/configuracao.md`) e agendar o backup mensal (passo 6).

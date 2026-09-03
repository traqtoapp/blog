# Blog do Traqto

Blog estatico em `blog.traqto.com`, feito para gerar trafego organico e levar
corretores imobiliarios ao produto.

- **Conteudo** no [Sanity](https://www.sanity.io) (CMS headless), editado pelo
  navegador em `/studio`.
- **Site** em Next.js com exportacao estatica — HTML puro, sem servidor Node.
- **Hospedagem** no GitLab Pages, cujo plano gratuito permite uso comercial.
- **Publicacao** 100% pelo navegador: salvar no Studio dispara um webhook que
  roda o pipeline do GitLab, que refaz o site e republica.

Nada precisa rodar no seu computador para publicar um post.

---

## Como funciona

```
   voce escreve no Studio            webhook do Sanity            pipeline do GitLab
  blog.traqto.com/studio  ───▶  (ao publicar/despublicar) ───▶  npm ci + next build
                                                                          │
                                                                          ▼
                                                                  GitLab Pages
                                                              blog.traqto.com
```

O site inteiro e reconstruido a cada publicacao (leva alguns minutos). Nao ha
revalidacao incremental — e a escolha deliberada por nao ter servidor: custo
zero de hospedagem em troca de um rebuild por publicacao.

## Stack

| Camada       | Escolha                                    | Por que |
| ------------ | ------------------------------------------ | ------- |
| Framework    | Next.js 16 (App Router), `output: 'export'` | Gera HTML estatico; o GitLab Pages nao roda Node |
| Linguagem    | TypeScript + React 19                       | Padrao do ecossistema |
| CMS          | Sanity (Content Lake + Studio embutido)     | Edicao pelo navegador, plano gratuito, conteudo fora do repositorio |
| Estilo       | CSS puro com variaveis                      | Sem dependencia extra de build |
| Hospedagem   | GitLab Pages                                | Uso comercial permitido no plano gratuito, projeto isolado por empresa |
| CI/CD        | GitLab CI (`.gitlab-ci.yml`)                | Build no push, no webhook e no agendamento de backup |

## Primeiro uso (configuracao inicial)

O codigo esta pronto, mas as contas externas precisam ser ligadas uma vez.
O passo a passo completo esta em **[docs/configuracao.md](docs/configuracao.md)**:

1. criar o projeto no Sanity e pegar o `projectId`;
2. criar o projeto no GitLab e cadastrar as variaveis de CI/CD;
3. apontar o dominio `blog.traqto.com` para o GitLab Pages;
4. ligar o webhook do Sanity ao pipeline;
5. agendar o backup mensal do conteudo.

## Rodar localmente (opcional)

Nao e necessario para publicar — serve para mexer no layout ou no schema.

```bash
npm install
cp .env.example .env.local     # preencha NEXT_PUBLIC_SANITY_PROJECT_ID
npm run dev                    # site em localhost:3000, Studio em /studio
```

Outros comandos:

```bash
npm run build       # gera o site estatico em out/
npm run typecheck   # checagem de tipos
```

O build **nao quebra** sem as variaveis do Sanity: sai um site vazio com um
aviso, o que mantem o pipeline verde antes de o CMS estar ligado.

## Estrutura

```
src/
  app/
    (site)/            paginas publicas (home, post, categoria, 404)
    (studio)/studio/   Sanity Studio embutido, layout proprio
    feed.xml/          feed RSS gerado no build
    sitemap.ts         sitemap.xml
    robots.ts          robots.txt
    globals.css        design system do blog
  components/          cabecalho, rodape, card, corpo do post, CTA, JSON-LD
  lib/                 configuracao do site, acesso ao conteudo, utilitarios
  sanity/
    schemas/           modelo de conteudo (post, autor, categoria, ajustes)
    queries.ts         consultas GROQ
    client.ts          leitura do Content Lake (com fallback vazio)
ci/backup-dataset.sh   exportacao mensal do conteudo
public/_redirects      rota interna do Studio no GitLab Pages
sanity.config.ts       configuracao do Studio
```

## SEO ja incluso

- `sitemap.xml` e `robots.txt` gerados no build a partir do conteudo publicado
- JSON-LD `Article` + `BreadcrumbList` em cada post e `Blog`/`CollectionPage` nas listagens
- meta tags, canonical, Open Graph e Twitter Card por pagina
- feed RSS em `/feed.xml`
- imagens servidas pelo CDN do Sanity, ja redimensionadas, com `width`/`height`
  no HTML (evita deslocamento de layout)
- campo obrigatorio ligando cada post a uma funcionalidade do Traqto

## Custo

| Item | Plano | Custo |
| ---- | ----- | ----- |
| Hospedagem e CI | GitLab Free | R$ 0 (minutos de CI mensais inclusos; um build leva ~2-3 min) |
| CMS | Sanity Free | R$ 0 dentro das cotas do plano gratuito |
| Certificado HTTPS | Let's Encrypt via GitLab | R$ 0 |
| Dominio | registrador do `traqto.com` | custo do dominio, ja existente |

Confira as cotas atuais em [about.gitlab.com/pricing](https://about.gitlab.com/pricing/)
e [sanity.io/pricing](https://www.sanity.io/pricing) — elas mudam com o tempo.

## Replicar em outra empresa

Este projeto e o molde para os proximos blogs. Para reaproveitar: copie o
repositorio, crie um projeto Sanity e um projeto GitLab novos (mantendo cada
empresa em contas separadas, sem acoplamento entre socios diferentes) e troque
as variaveis de ambiente. O unico codigo com identidade do Traqto esta em
`src/lib/site.ts`, nos textos de `src/app/(site)/` e no schema `siteSettings`.

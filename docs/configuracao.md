# Configuracao inicial

Passo a passo para colocar o blog no ar. E feito uma vez so; depois disso,
publicar um post e apenas escrever no `/studio` e clicar em **Publish**.

Tempo estimado: cerca de uma hora, mais o tempo de propagacao do DNS.

**Antes de comecar voce precisa de:**

- conta no [Sanity](https://www.sanity.io) (ja criada);
- conta no [GitLab](https://gitlab.com);
- acesso ao painel de DNS do dominio `traqto.com` (ja registrado), no
  registrador onde ele esta.

---

## Passo 1 — Projeto no Sanity

O projeto ja existe: **`p7j9d06t`**, e ele ja e o padrao no codigo
(`src/sanity/env.ts`). Falta so conferir duas configuracoes no painel.

1. Entre em [sanity.io/manage](https://www.sanity.io/manage) e abra o projeto.
2. Em **Datasets**, confirme que existe o dataset **production** e que ele esta
   como **Public**.
   - Publico e o correto aqui: o conteudo do blog e publico por natureza, e
     assim o build le sem token nenhum. Se preferir dataset privado, crie um
     token de leitura e cadastre-o como `SANITY_API_READ_TOKEN` no passo 2.
3. Ainda em sanity.io/manage, abra **API > CORS origins** e adicione:

   | Origin | Allow credentials |
   | ------ | ----------------- |
   | `https://blog.traqto.com` | sim |
   | o endereco provisorio do GitLab Pages (passo 3) | sim, enquanto usar ele |
   | `http://localhost:3000` | sim (so se for editar pelo computador) |

   Cada endereco de onde voce abrir o Studio precisa estar nesta lista —
   inclusive o provisorio do GitLab, se for publicar por ele antes do dominio.

   Sem isso o Studio abre mas nao consegue autenticar.

4. Em **API > Tokens**, clique em **Add API token**:
   - Nome: `backup-ci`
   - Permissao: **Viewer** (somente leitura)
   - Guarde o token: ele e usado no passo 6 e nao aparece de novo.

---

## Passo 2 — Projeto no GitLab

O projeto ja existe: **https://gitlab.com/traqto/traqto-blog** (privado — o
site publicado continua publico, ver passo 3).

1. Suba o codigo, no seu clone do repositorio:

   ```bash
   git remote add gitlab https://gitlab.com/traqto/traqto-blog.git
   git push -u gitlab main
   ```

   O push ja dispara o primeiro pipeline sozinho.

3. Abra **Settings > CI/CD > Variables** e cadastre:

   | Chave | Valor | Observacao |
   | ----- | ----- | ---------- |
   | `SANITY_AUTH_TOKEN` | o token do passo 1.4 | **Masked**, so o job de backup usa |
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | `p7j9d06t` | opcional — ja e o padrao no codigo |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` | opcional — ja e o padrao |
   | `NEXT_PUBLIC_SITE_URL` | `https://blog.traqto.com` | opcional — ja e o padrao |
   | `NEXT_PUBLIC_TRAQTO_URL` | `https://traqto.com` | opcional — ja e o padrao |

   Na pratica so o `SANITY_AUTH_TOKEN` e obrigatorio. As demais existem para
   apontar o build para outro projeto ou endereco sem mexer no codigo — util,
   por exemplo, para um ambiente de teste.

   Deixe **Protected desmarcado** em todas — assim o build tambem funciona em
   branches de teste. Nao marque `Masked` nas variaveis `NEXT_PUBLIC_*`: elas
   sao publicas por definicao (vao para o HTML) e o mascaramento so atrapalha a
   leitura dos logs.

---

## Passo 3 — Primeiro deploy

1. O push do passo 2 ja dispara o pipeline. Acompanhe em **Build > Pipelines**.
2. Em **Deploy > Pages**, deixe **"Use unique domain" LIGADO**. Isso importa:
   com ele, o site fica na raiz de um subdominio proprio
   (`https://traqto-blog-xxxx.gitlab.io/`). Desligado, o endereco vira
   `https://traqto.gitlab.io/traqto-blog/` — um subdiretorio — e o site quebra,
   porque o build gera caminhos absolutos (`/_next/...`, `/blog/...`) contando
   estar na raiz. Fazer funcionar em subdiretorio exigiria `basePath` no
   next.config.ts, que depois teria de ser desfeito ao ligar o dominio proprio.
3. Quando o job `pages` terminar, abra **Deploy > Pages** e clique no endereco
   que aparece ali. O site deve carregar com o aviso de "Nenhum post publicado".
4. Em **Settings > General > Visibility, project features, permissions**,
   confirme que **Pages** esta como **Everyone**. Se ficar em "Only project
   members", o blog exige login do GitLab para ser lido — e nao e indexado pelo
   Google.

> O endereco provisorio ja serve para conferir o layout. As URLs internas
> (canonical, sitemap, RSS) apontam para `blog.traqto.com` porque e o
> endereco definitivo configurado em `NEXT_PUBLIC_SITE_URL`.

---

## Passo 4 — Dominio `blog.traqto.com`

1. Em **Deploy > Pages > New domain**, cadastre `blog.traqto.com`.
2. O GitLab mostra dois registros. Crie os dois no painel de DNS do dominio:

   | Tipo | Nome | Valor |
   | ---- | ---- | ----- |
   | CNAME | `blog` | o host que o GitLab mostrar (ex.: `seu-usuario.gitlab.io`) |
   | TXT | `_gitlab-pages-verification-code.blog` | o codigo que o GitLab mostrar |

   Copie os valores exatamente como aparecem na tela do GitLab — o host varia
   conforme a conta.

3. Volte na pagina do dominio no GitLab e clique em **Verify ownership**.
   A propagacao do DNS costuma levar de minutos a algumas horas.
4. Verificado o dominio, marque **Force HTTPS**. O certificado Let's Encrypt e
   emitido automaticamente e renovado sozinho, sem custo.

---

## Passo 5 — Publicacao automatica (webhook)

O objetivo: clicar em **Publish** no Studio e o site se refazer sozinho.

1. No GitLab, va em **Settings > CI/CD > Pipeline trigger tokens > Add trigger**.
   Descricao: `sanity-publish`. Copie o token gerado.
2. Monte a URL do webhook trocando apenas `SEU_TOKEN`:

   ```
   https://gitlab.com/api/v4/projects/traqto%2Ftraqto-blog/trigger/pipeline?token=SEU_TOKEN&ref=main
   ```

   O `%2F` no meio do caminho e a barra de `traqto/traqto-blog` codificada — a
   API do GitLab aceita o caminho do projeto no lugar do ID numerico, entao nao
   e preciso procurar o numero em lugar nenhum.

3. Em sanity.io/manage, abra **API > Webhooks > Create webhook** e preencha:

   | Campo | Valor |
   | ----- | ----- |
   | Name | `Rebuild GitLab Pages` |
   | URL | a URL do item 2 |
   | Dataset | `production` |
   | Trigger on | Create, Update, Delete |
   | Filter | `_type in ["post", "category", "author", "siteSettings"]` |
   | Projection | `{"_id": _id, "_type": _type}` |
   | HTTP method | POST |
   | Drafts | **desligado** |

   A projecao enxuta evita mandar o post inteiro para a API do GitLab, que so
   precisa do aviso. Deixar drafts desligado evita um rebuild a cada rascunho
   salvo.

4. Teste: publique qualquer alteracao no Studio e veja se um pipeline novo
   aparece em **Build > Pipelines** com origem `trigger`.

> **A URL do webhook e um segredo.** Quem tiver o token pode disparar pipelines
> no seu projeto. Se vazar, revogue o trigger no GitLab e crie outro.

---

## Passo 6 — Backup mensal do conteudo

O conteudo mora no Sanity, fora do repositorio de codigo. O pipeline agendado
exporta tudo (documentos em NDJSON + imagens) para um `.tar.gz`.

1. No GitLab, va em **Build > Pipeline schedules > New schedule**:

   | Campo | Valor |
   | ----- | ----- |
   | Description | `Backup mensal do Sanity` |
   | Interval pattern | Custom: `0 5 1 * *` (dia 1, 05:00 UTC) |
   | Target branch | `main` |
   | Variables | `EXECUTAR_BACKUP` = `true` |

   Sem a variavel `EXECUTAR_BACKUP` o agendamento nao faz nada — e a trava que
   impede o agendamento de sair republicando o site.

2. O arquivo fica como artefato do job por 6 meses. **Isso ainda e uma copia
   dentro do GitLab.** Para ter uma copia fora do Sanity e fora do GitLab,
   cadastre tambem estas variaveis (exemplo com um bucket S3, Backblaze B2 ou
   Cloudflare R2):

   | Chave | Exemplo |
   | ----- | ------- |
   | `BACKUP_REMOTE` | `destino:meu-bucket/traqto-blog` |
   | `RCLONE_CONFIG_DESTINO_TYPE` | `s3` |
   | `RCLONE_CONFIG_DESTINO_PROVIDER` | `Other` |
   | `RCLONE_CONFIG_DESTINO_ACCESS_KEY_ID` | (masked) |
   | `RCLONE_CONFIG_DESTINO_SECRET_ACCESS_KEY` | (masked) |
   | `RCLONE_CONFIG_DESTINO_ENDPOINT` | endpoint do provedor |

   O script `ci/backup-dataset.sh` detecta essas variaveis e envia o arquivo.
   Sem elas, ele avisa no log que a unica copia e o artefato do GitLab.

3. **Teste a restauracao pelo menos uma vez por ano.** Baixe o `.tar.gz` do
   artefato e rode, com o token do passo 1.4:

   ```bash
   SANITY_AUTH_TOKEN=... npx sanity dataset import backup.tar.gz production --replace
   ```

   Para nao mexer no dataset de producao no teste, importe para um dataset novo
   (`npx sanity dataset create teste-restauracao` e importe para `teste-restauracao`).

---

## Passo 7 — Primeiro post

1. Abra `https://blog.traqto.com/studio` e entre com sua conta Sanity.
2. Em **Configuracoes do blog**, preencha nome, descricao e a chamada da home.
3. Crie uma **Categoria** (ex.: "Proposta de compra") e um **Autor**.
4. Crie um **Post**. Todos os campos com asterisco sao obrigatorios, incluindo a
   ligacao com a funcionalidade do Traqto — e ela que transforma leitura em
   visita ao produto.
5. Clique em **Publish**. Em poucos minutos o post esta no ar.
6. Cadastre `https://blog.traqto.com/sitemap.xml` no
   [Google Search Console](https://search.google.com/search-console).

O checklist editorial de cada post esta em [editorial.md](editorial.md).

---

## Quando algo da errado

| Sintoma | Causa provavel | O que fazer |
| ------- | -------------- | ----------- |
| Studio abre e fica girando, ou da erro de CORS | origem nao liberada | Passo 1.3: adicionar a URL em CORS origins com "allow credentials" |
| Post publicado nao aparece no site | webhook nao disparou | Ver o log de entregas do webhook em sanity.io/manage e se surgiu pipeline em Build > Pipelines |
| Pipeline falha em `npm ci` | `package-lock.json` fora de sincronia | Rodar `npm install` local e commitar o lock atualizado |
| Site pede login do GitLab | Pages access control | Passo 3.3: deixar Pages como "Everyone" |
| Imagens nao carregam | dataset privado sem token | Tornar o dataset publico ou definir `SANITY_API_READ_TOKEN` |
| `/studio/algo` da 404 ao recarregar | regra de rewrite | Confirmar que `public/_redirects` foi para o build (`out/_redirects`) |
| Build acusa "returned an empty array from generateStaticParams" | nao deveria acontecer | O projeto ja trata CMS vazio; se aparecer, confira se `NEXT_PUBLIC_SANITY_PROJECT_ID` esta correto |

Sem minutos de CI disponiveis no mes, o site continua no ar — apenas para de se
atualizar ate a cota renovar. O GitLab pode pedir validacao por cartao para
liberar os runners gratuitos (sem cobranca).

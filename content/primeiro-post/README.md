# Primeiro post — CNM (Código Nacional de Matrícula)

Esta pasta e um **material de importacao unico**, nao a fonte da verdade do
conteudo. Depois que o post entrar no Sanity, e la que ele vive e e editado;
esta pasta pode ate ser apagada.

## O que tem aqui

| Arquivo | Para que serve |
| ------- | -------------- |
| `artigo-para-colar.html` | O artigo formatado, para copiar e colar no Studio |
| `post.ndjson` | O post completo (com metadados) para importar por comando |
| `cnm-estrutura.png` | Imagem de capa: o diagrama dos 16 digitos do CNM |
| `body.portabletext.json` | O corpo ja convertido para o formato do Sanity |

Escolha **um** dos dois caminhos abaixo. O resultado e o mesmo.

---

## Caminho A — pelo navegador, sem terminal

1. Abra o Studio (`npm run dev` e `localhost:3000/studio`, ou
   `blog.traqto.com/studio` depois do deploy) e entre com sua conta Sanity.
2. **Categorias > criar**: nome `Due diligence`, slug `due-diligence`,
   descricao `Documentos, certidões e matrícula: o que conferir antes de fechar uma negociação.`
   Publique.
3. **Posts > criar** e preencha com os valores da secao "Campos" abaixo.
4. No campo **Corpo do post**: abra `artigo-para-colar.html` no navegador,
   selecione tudo abaixo da caixa azul, copie e cole. O Sanity converte
   titulos, negrito, listas e links sozinho.
5. **Imagem de capa**: suba o `cnm-estrutura.png` e preencha o texto
   alternativo indicado abaixo.
6. Confira e clique em **Publish**.

## Caminho B — um comando

Cria tudo de uma vez, ja com a imagem, e deixa o post como **rascunho** no
Studio esperando sua aprovacao:

```bash
cd content/primeiro-post
SANITY_AUTH_TOKEN=seu-token npx sanity dataset import post.ndjson production
```

O token e o mesmo do passo 1.4 de `docs/configuracao.md` — mas para importar
ele precisa de permissao de **escrita** (Editor), nao so de leitura.

Depois abra o Studio: o post aparece como rascunho. Revise e clique em
**Publish**.

---

## Campos

| Campo | Valor |
| ----- | ----- |
| Titulo | CNM: o que é o Código Nacional de Matrícula e como ele muda o registro de imóveis no Brasil |
| Slug | `cnm-codigo-nacional-de-matricula` |
| Resumo | O CNM é o CPF do imóvel: um código único e nacional para cada matrícula. Entenda os 16 dígitos, a base legal e o que muda na due diligence. |
| Categoria | Due diligence |
| Texto alternativo da capa | Estrutura do Código Nacional de Matrícula: 6 dígitos da serventia, 1 do livro, 7 do número de ordem e 2 verificadores |
| SEO > Titulo para o Google | CNM: o que é o Código Nacional de Matrícula de imóveis |
| SEO > Meta description | O Código Nacional de Matrícula (CNM) é a numeração única de cada matrícula de imóvel no Brasil. Veja a estrutura dos 16 dígitos, a base legal e como consultar. |
| SEO > Palavra-chave | código nacional de matrícula |
| Traqto > Funcionalidade | Checklist de due diligence |
| Traqto > Frase de ligacao | No Traqto a matrícula e as certidões do imóvel ficam num checklist por negociação, mostrando o que já foi conferido e o que ainda falta. |
| Traqto > Link | `https://traqto.com` — **trocar pela URL real da funcionalidade** |
| Traqto > Texto do botao | Ver o checklist do Traqto |

## Duas alteracoes feitas no texto original

1. "A imagem acima ilustra essa divisão" virou "O diagrama no topo desta página
   ilustra essa divisão": no blog a capa aparece no topo, antes do texto, entao
   "acima" ficaria ambiguo.
2. A mencao a `cnm.onr.org.br` virou link para `https://cnm.onr.org.br`.

O restante do texto esta igual ao que voce escreveu.

## Antes de publicar

- [ ] Trocar o link da funcionalidade do Traqto pela URL real.
- [ ] Conferir se quer assinar o post com um autor (o campo e opcional; sem
      autor, os dados estruturados atribuem o texto a organizacao Traqto).

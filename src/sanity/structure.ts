import type { StructureResolver } from 'sanity/structure'

/**
 * Menu lateral do Studio.
 *
 * "Configuracoes do blog" e um singleton: abre direto no unico documento, em
 * vez de mostrar uma lista onde daria para criar copias por engano.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Conteudo')
    .items([
      S.listItem()
        .title('Posts')
        .schemaType('post')
        .child(
          S.documentTypeList('post')
            .title('Posts')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
        ),
      S.divider(),
      S.documentTypeListItem('category').title('Categorias'),
      S.documentTypeListItem('author').title('Autores'),
      S.divider(),
      S.listItem()
        .title('Configuracoes do blog')
        .id('siteSettings')
        .schemaType('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])

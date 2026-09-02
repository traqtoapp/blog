import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Corpo do post (rich text / Portable Text).
 *
 * Os estilos disponiveis sao deliberadamente poucos: H2/H3 para estrutura de
 * SEO, citacao e listas. O H1 fica reservado ao titulo do post, para nao ter
 * dois H1 na mesma pagina.
 */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Conteudo',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragrafo', value: 'normal' },
        { title: 'Titulo de secao (H2)', value: 'h2' },
        { title: 'Subtitulo (H3)', value: 'h3' },
        { title: 'Citacao', value: 'blockquote' },
      ],
      lists: [
        { title: 'Lista com marcadores', value: 'bullet' },
        { title: 'Lista numerada', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Negrito', value: 'strong' },
          { title: 'Italico', value: 'em' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule.required().uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Abrir em nova aba',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          }),
          defineArrayMember({
            name: 'internalLink',
            title: 'Link para outro post',
            type: 'object',
            fields: [
              defineField({
                name: 'reference',
                title: 'Post',
                type: 'reference',
                to: [{ type: 'post' }],
                validation: (rule) => rule.required(),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Imagem',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Descreve a imagem para leitores de tela e para o Google. Obrigatorio.',
          validation: (rule) => rule.required().max(160),
        }),
        defineField({
          name: 'caption',
          title: 'Legenda (opcional)',
          type: 'string',
        }),
      ],
    }),
    defineArrayMember({
      name: 'callout',
      title: 'Destaque',
      type: 'object',
      description: 'Caixa destacada para dicas, avisos e checklists curtos.',
      fields: [
        defineField({
          name: 'tone',
          title: 'Tom',
          type: 'string',
          options: {
            list: [
              { title: 'Dica', value: 'tip' },
              { title: 'Atencao', value: 'warning' },
            ],
            layout: 'radio',
          },
          initialValue: 'tip',
        }),
        defineField({
          name: 'title',
          title: 'Titulo',
          type: 'string',
        }),
        defineField({
          name: 'text',
          title: 'Texto',
          type: 'text',
          rows: 4,
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: { title: 'title', subtitle: 'text' },
      },
    }),
  ],
})

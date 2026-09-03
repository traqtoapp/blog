import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Conteudo', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'traqto', title: 'Ligacao com o Traqto' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titulo',
      type: 'string',
      group: 'content',
      description: 'Aparece como H1 do post e como titulo padrao no Google.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (endereco do post)',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // remove acentos
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .slice(0, 96),
      },
      description: 'Endereco final: blog.traqto.com/blog/SEU-SLUG. Evite mudar depois de publicado.',
      // O slug entra cru no sitemap.xml e no feed.xml. Um "&" digitado a mao
      // deixaria os dois arquivos com XML invalido — o Search Console rejeita o
      // sitemap inteiro e os leitores de RSS param de ler o feed inteiro, nao
      // so aquele post.
      validation: (rule) =>
        rule.required().custom((value) =>
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value?.current ?? '')
            ? true
            : 'Use apenas letras minusculas, numeros e hifens (ex.: prazos-de-escritura).',
        ),
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumo',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        'De 120 a 160 caracteres. E o texto que aparece na listagem, no RSS e, se o campo de SEO estiver vazio, tambem no Google.',
      validation: (rule) => rule.required().min(50).max(200),
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagem de capa',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (rule) => rule.required().max(160),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de publicacao',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Data da ultima revisao',
      type: 'datetime',
      group: 'content',
      description: 'Preencha ao revisar um post antigo — o Google usa isso para reordenar conteudo atualizado.',
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'content',
    }),
    defineField({
      name: 'categories',
      title: 'Categorias',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      group: 'content',
      validation: (rule) => rule.unique().max(3),
    }),
    defineField({
      name: 'body',
      title: 'Corpo do post',
      type: 'blockContent',
      group: 'content',
      validation: (rule) => rule.required(),
    }),

    // --- Ligacao com o produto -------------------------------------------
    defineField({
      name: 'traqtoLink',
      title: 'Funcionalidade do Traqto ligada a este post',
      type: 'object',
      group: 'traqto',
      description:
        'Todo post precisa apontar para a etapa correspondente do fluxo do Traqto. E o que transforma trafego de SEO em visita ao produto.',
      fields: [
        defineField({
          name: 'feature',
          title: 'Nome da funcionalidade',
          type: 'string',
          description: 'Ex.: "Proposta de compra digital", "Checklist de due diligence".',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Frase de ligacao',
          type: 'text',
          rows: 2,
          description: 'Uma frase conectando o assunto do post a essa funcionalidade.',
          validation: (rule) => rule.required().max(240),
        }),
        defineField({
          name: 'url',
          title: 'Link',
          type: 'url',
          description: 'URL da funcionalidade no site do Traqto.',
          validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
        }),
        defineField({
          name: 'ctaText',
          title: 'Texto do botao',
          type: 'string',
          initialValue: 'Conhecer o Traqto',
          validation: (rule) => rule.required().max(40),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // --- SEO ---------------------------------------------------------------
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Titulo para o Google',
          type: 'string',
          description: 'Deixe vazio para usar o titulo do post. Ideal ate 60 caracteres.',
          validation: (rule) => rule.max(70),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          description: 'Deixe vazio para usar o resumo. Ideal entre 120 e 160 caracteres.',
          validation: (rule) => rule.max(200),
        }),
        defineField({
          name: 'keyphrase',
          title: 'Palavra-chave principal',
          type: 'string',
          description: 'Só para organizacao editorial — nao vai para o HTML.',
        }),
        defineField({
          name: 'noIndex',
          title: 'Nao indexar este post',
          type: 'boolean',
          description: 'Marque para excluir o post do Google, do sitemap e do RSS.',
          initialValue: false,
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Mais recentes',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'excerpt', media: 'coverImage', date: 'publishedAt' },
    prepare({ title, subtitle, media, date }) {
      const formatted = date ? new Date(date).toLocaleDateString('pt-BR') : 'sem data'
      return { title, subtitle: `${formatted} — ${subtitle ?? ''}`, media }
    },
  },
})

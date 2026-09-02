import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Categoria',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descricao',
      type: 'text',
      rows: 3,
      description: 'Usada como meta description da pagina da categoria.',
      validation: (rule) => rule.max(200),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})

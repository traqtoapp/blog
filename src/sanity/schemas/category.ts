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
      // Mesmo motivo do slug do post: ele entra cru no sitemap.xml.
      validation: (rule) =>
        rule.required().custom((value) =>
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value?.current ?? '')
            ? true
            : 'Use apenas letras minusculas, numeros e hifens (ex.: prazos-de-escritura).',
        ),
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

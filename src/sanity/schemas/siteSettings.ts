import { defineField, defineType } from 'sanity'

/**
 * Documento unico (singleton) com os textos globais do blog.
 * Permite ajustar titulo, descricao e chamadas sem mexer no codigo.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuracoes do blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome do blog',
      type: 'string',
      initialValue: 'Blog do Traqto',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descricao',
      type: 'text',
      rows: 3,
      description: 'Meta description da home e descricao do feed RSS.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'tagline',
      title: 'Chamada da home',
      type: 'string',
      description: 'Frase abaixo do titulo na pagina inicial.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagem social padrao',
      type: 'image',
      description: 'Usada quando um post nao tem capa. Formato 1200x630.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ctaTitle',
      title: 'Titulo do CTA do rodape',
      type: 'string',
      initialValue: 'Feche negocios sem perder o fio da meada',
    }),
    defineField({
      name: 'ctaText',
      title: 'Texto do CTA do rodape',
      type: 'text',
      rows: 2,
      initialValue:
        'O Traqto organiza proposta, due diligence e fechamento em um lugar so — sem planilha e sem grupo de WhatsApp.',
    }),
    defineField({
      name: 'ctaButtonLabel',
      title: 'Texto do botao do CTA',
      type: 'string',
      initialValue: 'Conhecer o Traqto',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Configuracoes do blog' }),
  },
})

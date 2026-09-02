import Link from 'next/link'

import { categoryPath, traqtoUrl } from '@/lib/site'

interface Props {
  title: string
  description: string
  categories: { title: string; slug: string }[]
}

export function SiteFooter({ title, description, categories }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__inner">
          <div style={{ maxWidth: '28rem' }}>
            <h2>{title}</h2>
            <p style={{ margin: 0 }}>{description}</p>
          </div>

          {categories.length > 0 && (
            <div>
              <h2>Temas</h2>
              <ul>
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link href={categoryPath(category.slug)}>{category.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2>Traqto</h2>
            <ul>
              <li>
                <a href={traqtoUrl}>Site do Traqto</a>
              </li>
              <li>
                <Link href="/">Todos os artigos</Link>
              </li>
              <li>
                <a href="/feed.xml">Assinar por RSS</a>
              </li>
            </ul>
          </div>
        </div>

        <p className="site-footer__legal">
          &copy; {year} Traqto. Conteudo informativo para corretores imobiliarios — nao substitui
          orientacao juridica.
        </p>
      </div>
    </footer>
  )
}

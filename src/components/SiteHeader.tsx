import Link from 'next/link'

import { categoryPath, traqtoUrl } from '@/lib/site'

interface Props {
  categories: { title: string; slug: string }[]
}

export function SiteHeader({ categories }: Props) {
  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link href="/" className="brand">
          <span className="brand__mark">Traqto</span>
          <span className="brand__suffix">Blog</span>
        </Link>

        <nav className="site-nav" aria-label="Navegacao principal">
          {categories.slice(0, 4).map((category) => (
            <Link key={category.slug} href={categoryPath(category.slug)}>
              {category.title}
            </Link>
          ))}
          <a className="button button--ghost" href={traqtoUrl}>
            Conhecer o Traqto
          </a>
        </nav>
      </div>
    </header>
  )
}

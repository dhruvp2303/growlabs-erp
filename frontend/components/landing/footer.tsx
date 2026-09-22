import Link from 'next/link'
import { Logo } from '@/components/brand/logo'

const columns = [
  {
    title: 'Platform',
    links: ['Inventory', 'Production', 'Sales & CRM', 'Finance', 'AI Insights'],
  },
  {
    title: 'Solutions',
    links: ['Manufacturing', 'Retail', 'Distribution', 'Field Services', 'Construction'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Blog', 'Contact', 'Partners'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Guides', 'Changelog', 'Status', 'Security'],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The AI-powered ERP that builds itself around your business — so you run operations your
              way.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GrowLabs. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Cookies'].map((l) => (
              <Link
                key={l}
                href="#"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

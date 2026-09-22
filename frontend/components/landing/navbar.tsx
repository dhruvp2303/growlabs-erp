'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Platform', href: '#platform' },
  { label: 'Solutions', href: '#problem' },
  { label: 'AI', href: '#ai' },
  { label: 'Industries', href: '#industries' },
  { label: 'How It Works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#resources' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'py-2' : 'py-4',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={cn(
            'flex items-center justify-between rounded-2xl border border-border px-4 transition-all duration-300',
            scrolled ? 'h-14 glass shadow-lg shadow-black/20' : 'h-16 bg-transparent',
          )}
          aria-label="Primary"
        >
          <Link href="/" className="flex items-center" aria-label="GrowLabs home">
            <Logo />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="ghost" size="lg" nativeButton={false} render={<Link href="/login" />}>
              Log in
            </Button>
            <Button size="lg" nativeButton={false} render={<Link href="/signup" />}>
              Get Started
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>

        {open && (
          <div className="mt-2 rounded-2xl border border-border glass p-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/login" />}>
                Log in
              </Button>
              <Button size="lg" nativeButton={false} render={<Link href="/signup" />}>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

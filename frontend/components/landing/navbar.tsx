'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, Sparkles, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { ShimmerButton } from '@/components/animated/shimmer-button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'

const navItems = [
  { label: 'Platform', href: '#platform' },
  { label: 'Autonomous AI', href: '#ai' },
  { label: 'Industries', href: '#industries' },
  { label: 'How It Works', href: '#how' },
  { label: 'Modular Pricing', href: '#pricing' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

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
        scrolled ? 'py-2.5' : 'py-5'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={cn(
            'flex items-center justify-between rounded-2xl border px-4 transition-all duration-300',
            scrolled
              ? 'h-14 border-white/10 bg-card/75 shadow-2xl shadow-black/40 backdrop-blur-2xl'
              : 'h-16 border-white/5 bg-card/30 backdrop-blur-md'
          )}
          aria-label="Primary"
        >
          {/* Logo & Live Status */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center" aria-label="GrowLabs home">
              <Logo />
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[10px] font-medium text-success">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              <span>Engine v4.2 Live</span>
            </div>
          </div>

          {/* Desktop Nav Items with Morphing Hover Pill */}
          <div className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHoveredIdx(null)}>
            {navItems.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHoveredIdx(idx)}
                className="relative rounded-xl px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {hoveredIdx === idx && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 -z-10 rounded-xl bg-white/[0.08] border border-white/10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                {item.label}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden items-center gap-3 sm:flex">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Log in
            </Button>

            <Link href="/signup">
              <ShimmerButton className="h-9 px-4 text-xs font-bold shadow-sm">
                <span>Deploy ERP</span>
                <Sparkles className="size-3 text-accent" />
              </ShimmerButton>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-2 rounded-2xl border border-white/10 bg-card/90 p-4 shadow-2xl backdrop-blur-2xl lg:hidden"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/10 bg-white/[0.03]"
                  nativeButton={false}
                  render={<Link href="/login" />}
                >
                  Log in
                </Button>
                <Link href="/signup" onClick={() => setOpen(false)}>
                  <ShimmerButton className="w-full h-11 text-sm font-semibold">
                    Deploy Free ERP
                  </ShimmerButton>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

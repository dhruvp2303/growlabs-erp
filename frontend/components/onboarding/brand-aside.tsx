'use client'

import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/brand/logo'

interface BrandAsideProps {
  eyebrow: string
  title: string
  points: string[]
}

export function BrandAside({ eyebrow, title, points }: BrandAsideProps) {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-card/30 p-10 lg:flex">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-glow opacity-70" />
      <Link href="/" aria-label="GrowLabs home">
        <Logo />
      </Link>

      <div className="max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>
        <h2 className="mt-3 text-balance font-display text-3xl font-bold leading-tight">{title}</h2>
        <ul className="mt-8 flex flex-col gap-4">
          {points.map((point, i) => (
            <motion.li
              key={point}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
              className="flex items-start gap-3"
            >
              <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Check className="size-3" />
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-4">
        <div className="flex -space-x-2">
          {['from-primary to-accent', 'from-accent to-success', 'from-warning to-primary'].map(
            (g) => (
              <span
                key={g}
                className={`size-8 rounded-full border-2 border-card bg-gradient-to-br ${g}`}
              />
            ),
          )}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Join <span className="font-semibold text-foreground">3,400+</span> operations running on
          GrowLabs
        </p>
      </div>
    </aside>
  )
}

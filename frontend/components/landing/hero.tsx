'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, PlayCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroPreview } from '@/components/landing/hero-preview'

const trustLogos = ['Meridian', 'Delta Works', 'Coastal Agri', 'Northwind', 'BlueRock']

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 lg:pt-44">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-glow" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="size-3.5 text-accent" />
            AI-Powered Personalized ERP
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Your Business. Your ERP. <span className="text-gradient">Your Way.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            GrowLabs understands how your business actually works, then builds an ERP experience around
            the processes, teams, and features you need — nothing you don&apos;t. No rigid templates. No
            bloated modules.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button size="lg" className="h-11 px-6 text-sm" nativeButton={false} render={<Link href="/signup" />}>
              Build My ERP
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-11 px-6 text-sm"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              <PlayCircle className="size-4" data-icon="inline-start" />
              See Live Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              Trusted by growing operations
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
              {trustLogos.map((name) => (
                <span key={name} className="font-display text-sm font-semibold text-muted-foreground/50">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <HeroPreview />
      </div>
    </section>
  )
}

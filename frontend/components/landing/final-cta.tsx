'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/animated/reveal'

export function FinalCta() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card/40 px-6 py-16 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-glow" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-accent">
              <Sparkles className="size-3.5" />
              Set up in minutes, not months
            </span>

            <h2 className="mx-auto mt-6 max-w-2xl text-balance font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Build the ERP your business <span className="text-gradient">actually deserves</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              Answer a few questions and watch GrowLabs assemble a personalized ERP around your
              operation. Free to start — no credit card required.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
                Explore Live Demo
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

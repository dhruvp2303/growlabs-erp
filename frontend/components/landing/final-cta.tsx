'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, CheckCircle, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShimmerButton } from '@/components/animated/shimmer-button'
import { BackgroundConstellation } from '@/components/animated/background-constellation'
import { motion } from 'motion/react'

export function FinalCta() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-card/80 via-card/50 to-background/90 px-6 py-20 text-center shadow-2xl shadow-primary/10 backdrop-blur-2xl sm:px-12 sm:py-24"
        >
          {/* Constellation inside the CTA */}
          <BackgroundConstellation particleCount={30} maxDistance={100} />

          {/* Glowing Aura Orb */}
          <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/25 via-accent/20 to-purple-500/20 blur-[120px] animate-pulse-glow" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent backdrop-blur-md shadow-md shadow-accent/10">
            <Sparkles className="size-3.5 animate-pulse" />
            <span>Ready in under 3 minutes · Zero migration lock-in</span>
          </div>

          <h2 className="mx-auto mt-6 max-w-3xl text-balance font-display text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            Build the ERP your enterprise{' '}
            <span className="text-gradient">was meant to operate on</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Experience hyper-fluid supply chain tracking, autonomous AI copilot dispatching, and zero-bloat modularity. Free to start with unlimited team seats.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <ShimmerButton className="h-13 px-8 text-base">
                Architect My ERP Free
                <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-1" />
              </ShimmerButton>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="h-13 border-white/15 bg-card/60 px-8 text-base backdrop-blur-md transition-all hover:border-white/30 hover:bg-card"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Explore Interactive Demo
            </Button>
          </div>

          {/* Assurance Row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground/80">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="size-3.5 text-success" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="size-3.5 text-primary" />
              <span>Enterprise encryption & SOC2</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-accent" />
              <span>1-click schema generator</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, PlayCircle, Sparkles, ShieldCheck, Zap, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroPreview } from '@/components/landing/hero-preview'
import { BackgroundConstellation } from '@/components/animated/background-constellation'
import { ShimmerButton } from '@/components/animated/shimmer-button'
import { TiltCard } from '@/components/animated/tilt-card'
import { Marquee } from '@/components/animated/marquee'
import { Magnetic } from '@/components/animated/magnetic'

const trustLogos = [
  { name: 'Meridian Flow', badge: 'Manufacturing' },
  { name: 'Delta Works', badge: 'Logistics' },
  { name: 'Coastal Agri', badge: 'Supply Chain' },
  { name: 'Northwind Tech', badge: 'Enterprise' },
  { name: 'BlueRock Labs', badge: 'Biotech' },
  { name: 'Apex Automation', badge: 'Robotics' },
]

export function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-32 pb-20 sm:pt-40 lg:pt-44">
      {/* Interactive 3D/Canvas Particle Constellation */}
      <BackgroundConstellation particleCount={50} maxDistance={130} />

      {/* Ambient background glows & grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px] animate-pulse-glow" />
      <div className="pointer-events-none absolute top-1/3 right-10 -z-10 h-[400px] w-[500px] rounded-full bg-accent/15 blur-[120px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10">
        <div>
          {/* Top Pill */}
          <Magnetic strength={0.2}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary shadow-lg shadow-primary/10 backdrop-blur-md"
            >
              <Sparkles className="size-3.5 text-accent animate-pulse" />
              <span>Next-Gen Intelligent ERP</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span className="text-muted-foreground">Self-Architecting</span>
            </motion.div>
          </Magnetic>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-5 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Your Business. Your ERP.{' '}
            <span className="text-gradient">Engineered to Flow.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            GrowLabs deeply understands your real-world operations, dynamically assembling a bespoke ERP
            experience with autonomous AI agents, zero bloated modules, and real-time operational telemetry.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link href="/signup">
              <ShimmerButton className="h-12 w-full px-7 text-sm sm:w-auto">
                Build My ERP Free
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </ShimmerButton>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="h-12 border-white/10 bg-card/40 px-6 text-sm backdrop-blur-md transition-all hover:border-white/25 hover:bg-card/70"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              <PlayCircle className="size-4 text-accent" data-icon="inline-start" />
              Explore Interactive Demo
            </Button>
          </motion.div>

          {/* Value Micro-Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-success" />
              <span>SOC2 & ISO Ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-accent" />
              <span>Instant 3-Min Setup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="size-3.5 text-primary" />
              <span>99.99% Uptime SLA</span>
            </div>
          </motion.div>

          {/* Trust Ticker with Marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 max-w-xl border-t border-white/10 pt-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              Trusted by 500+ modern operations worldwide
            </p>
            <div className="mt-4 overflow-hidden">
              <Marquee speed="normal" pauseOnHover={true} className="py-1">
                {trustLogos.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 rounded-lg border border-white/5 bg-card/40 px-3.5 py-1.5 text-xs text-foreground/80 backdrop-blur-sm transition-colors hover:border-white/15"
                  >
                    <span className="font-display font-semibold text-foreground">{item.name}</span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {item.badge}
                    </span>
                  </div>
                ))}
              </Marquee>
            </div>
          </motion.div>
        </div>

        {/* Hero Interactive 3D Tilt Mockup */}
        <TiltCard maxTilt={6} scale={1.015} className="w-full">
          <HeroPreview />
        </TiltCard>
      </div>
    </section>
  )
}

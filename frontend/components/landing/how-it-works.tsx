'use client'

import { MessageCircleQuestion, Cpu, LayoutDashboard, Rocket, TrendingUp } from 'lucide-react'
import { Reveal } from '@/components/animated/reveal'
import { SectionHeading } from '@/components/landing/section-heading'

const steps = [
  {
    icon: MessageCircleQuestion,
    title: 'Tell us about your business',
    desc: 'Industry, size, and how your teams work. A short guided conversation — no spec documents.',
  },
  {
    icon: Cpu,
    title: 'AI designs your ERP',
    desc: 'GrowLabs selects the right modules, maps your workflows, and configures roles automatically.',
  },
  {
    icon: LayoutDashboard,
    title: 'Review your blueprint',
    desc: 'See a live preview of your dashboards and modules. Tweak anything with a click.',
  },
  {
    icon: Rocket,
    title: 'Go live in days',
    desc: 'Import your data or start fresh. Your personalized ERP is ready for your whole team.',
  },
  {
    icon: TrendingUp,
    title: 'Grow with intelligence',
    desc: 'As you scale, AI recommends new modules and optimizations tuned to your data.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How It Works"
          title={
            <>
              From first question to fully live in <span className="text-gradient">five steps</span>
            </>
          }
          description="No implementation team. No six-month rollout. Just answer, review, and launch."
        />

        <div className="relative mt-16">
          <div
            className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-accent/50 to-transparent lg:hidden"
            aria-hidden="true"
          />
          <ol className="grid gap-6 lg:grid-cols-5 lg:gap-4">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <li className="relative flex gap-4 lg:flex-col">
                  <div className="relative z-10 flex shrink-0 items-center lg:mb-2">
                    <span className="inline-flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-card text-primary shadow-lg shadow-primary/10">
                      <step.icon className="size-6" />
                    </span>
                    <span className="absolute -right-2 -top-2 inline-flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[11px] font-bold text-primary-foreground lg:right-auto lg:-left-2">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

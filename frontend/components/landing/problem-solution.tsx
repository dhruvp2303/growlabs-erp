'use client'

import { Check, X } from 'lucide-react'
import { Reveal } from '@/components/animated/reveal'
import { SectionHeading } from '@/components/landing/section-heading'

const rows = [
  {
    problem: 'Months of implementation and costly consultants',
    solution: 'A working ERP in days — GrowLabs configures itself around you',
  },
  {
    problem: 'Hundreds of features you never use, cluttering every screen',
    solution: 'Only the modules your business actually needs, nothing else',
  },
  {
    problem: 'Rigid workflows that force you to change how you work',
    solution: 'Workflows shaped to how your teams already operate',
  },
  {
    problem: 'Static reports that tell you what already happened',
    solution: 'AI that predicts what happens next and tells you what to do',
  },
  {
    problem: 'Per-seat pricing that punishes you for growing',
    solution: 'Modular pricing — pay for capabilities, scale on your terms',
  },
]

export function ProblemSolution() {
  return (
    <section id="problem" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Problem"
          title={
            <>
              Traditional ERPs weren&apos;t built for <span className="text-gradient">how you work</span>
            </>
          }
          description="Legacy systems force your business into their mold. GrowLabs flips that — the platform molds itself around your business."
        />

        <div className="mx-auto mt-14 max-w-4xl">
          <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="hidden items-center gap-2 px-2 sm:flex">
              <span className="text-sm font-semibold text-muted-foreground">Traditional ERP</span>
            </div>
            <div className="hidden items-center gap-2 px-2 sm:flex">
              <span className="text-sm font-semibold text-accent">GrowLabs</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {rows.map((row, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="group grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card/40 p-4">
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                      <X className="size-3" />
                    </span>
                    <p className="text-sm text-muted-foreground line-through/0">{row.problem}</p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/[0.07] p-4 transition-colors group-hover:border-primary/40">
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="size-3" />
                    </span>
                    <p className="text-sm font-medium text-foreground">{row.solution}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

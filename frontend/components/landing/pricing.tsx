'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { SectionHeading } from '@/components/landing/section-heading'
import { Reveal } from '@/components/animated/reveal'
import { CountUp } from '@/components/animated/count-up'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

const tiers = [
  {
    name: 'Starter',
    base: 149,
    tagline: 'For small teams getting organized',
    included: ['Up to 10 users', 'Inventory & Sales', 'Core dashboards', 'Email support'],
    popular: false,
  },
  {
    name: 'Growth',
    base: 399,
    tagline: 'For scaling operations that need AI',
    included: [
      'Up to 50 users',
      'All Starter modules',
      'AI alerts & forecasting',
      'Production & Procurement',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    base: 0,
    tagline: 'For complex, multi-site businesses',
    included: [
      'Unlimited users',
      'All modules unlocked',
      'Custom workflows & SSO',
      'Dedicated success manager',
    ],
    popular: false,
  },
]

const addOns = [
  { id: 'production', label: 'Production & Manufacturing', price: 120 },
  { id: 'logistics', label: 'Logistics & Shipping', price: 80 },
  { id: 'hr', label: 'HR & Workforce', price: 60 },
  { id: 'quality', label: 'Quality Control', price: 70 },
]

export function Pricing() {
  const [annual, setAnnual] = useState(true)
  const [selected, setSelected] = useState<string[]>(['production'])

  const addOnTotal = useMemo(
    () => addOns.filter((a) => selected.includes(a.id)).reduce((sum, a) => sum + a.price, 0),
    [selected],
  )

  const growthPrice = 399 + addOnTotal
  const displayPrice = annual ? Math.round(growthPrice * 0.8) : growthPrice

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <section id="pricing" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Modular Pricing"
          title={
            <>
              Pay for what you use, <span className="text-gradient">scale when you grow</span>
            </>
          }
          description="Start with a base plan and switch on modules as you need them. No per-feature surprises."
        />

        <Reveal className="mt-8 flex items-center justify-center gap-3">
          <span className={cn('text-sm', !annual && 'text-foreground', annual && 'text-muted-foreground')}>
            Monthly
          </span>
          <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Toggle annual billing" />
          <span className={cn('text-sm', annual && 'text-foreground', !annual && 'text-muted-foreground')}>
            Annual
          </span>
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
            Save 20%
          </span>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => {
            const isGrowth = tier.name === 'Growth'
            const price = isGrowth
              ? displayPrice
              : annual
                ? Math.round(tier.base * 0.8)
                : tier.base
            return (
              <Reveal key={tier.name} delay={i * 0.08}>
                <div
                  className={cn(
                    'relative flex h-full flex-col rounded-2xl border p-6',
                    tier.popular
                      ? 'border-primary/40 bg-primary/[0.06] shadow-xl shadow-primary/10'
                      : 'border-border bg-card/40',
                  )}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-display text-lg font-semibold">{tier.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tier.tagline}</p>

                  <div className="mt-5 flex items-end gap-1">
                    {tier.base === 0 ? (
                      <span className="font-display text-3xl font-bold">Custom</span>
                    ) : (
                      <>
                        <span className="font-display text-4xl font-bold">
                          <CountUp value={price} format={(n) => formatCurrency(Math.round(n))} />
                        </span>
                        <span className="mb-1 text-sm text-muted-foreground">/mo</span>
                      </>
                    )}
                  </div>

                  <Button
                    className="mt-5 w-full"
                    size="lg"
                    variant={tier.popular ? 'default' : 'outline'}
                    nativeButton={false}
                    render={<Link href="/signup" />}
                  >
                    {tier.base === 0 ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>

                  <ul className="mt-6 flex flex-col gap-3">
                    {tier.included.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                          <Check className="size-2.5" />
                        </span>
                        <span className="text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {isGrowth && (
                    <div className="mt-6 border-t border-border pt-5">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent">
                        Add modules
                      </p>
                      <div className="flex flex-col gap-2.5">
                        {addOns.map((a) => {
                          const on = selected.includes(a.id)
                          return (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => toggle(a.id)}
                              className={cn(
                                'flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                                on
                                  ? 'border-primary/40 bg-primary/10'
                                  : 'border-border bg-background/40 hover:border-primary/25',
                              )}
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    'inline-flex size-4 items-center justify-center rounded-full transition-colors',
                                    on ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                                  )}
                                >
                                  {on ? <Check className="size-2.5" /> : <Plus className="size-2.5" />}
                                </span>
                                {a.label}
                              </span>
                              <span className="text-xs font-medium text-muted-foreground">
                                +${a.price}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

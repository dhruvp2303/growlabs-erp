'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Minus, HelpCircle, Sparkles } from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'Can I use GrowLabs on a phone or tablet without buying expensive hardware?',
    a: 'Yes, 100%! GrowLabs runs seamlessly on any mobile phone, tablet, iPad, or laptop. You can scan barcodes directly using your device camera, process sales, and generate digital WhatsApp/SMS receipts without needing expensive POS terminals or thermal printers.',
  },
  {
    q: 'How does the 30-day Netflix-style rental subscription work?',
    a: 'You can rent GrowLabs base access and any specialized add-on modules on a 30-day, 3-month, 6-month, or 1-year cycle. If you only need certain features during your peak festival or holiday season, activate them for 30 days. When the rush ends, turn them off with one click and your next bill updates automatically with zero penalty fees.',
  },
  {
    q: 'How does GrowLabs handle clothing stores with different sizes and colors?',
    a: 'GrowLabs comes with a built-in Fashion Variant Matrix. A single product automatically generates a Size (XS, S, M, L, XL, XXL) × Color × Fabric grid. You can print individual barcode stickers for each size and color and track exact stock across physical stores.',
  },
  {
    q: 'How does recipe-level ingredient tracking work for restaurants & cafes?',
    a: 'When you create menu items (e.g. 1× Cheese Pizza), you define its recipe bill of materials (200g dough, 80g cheese, 40g tomato sauce). Each time a cashier or waiter bills that pizza, GrowLabs automatically deducts those exact quantities from raw stock in real-time.',
  },
  {
    q: 'Can multi-outlet mall chains transfer stock between stores?',
    a: 'Yes! Store managers can initiate instant stock transfer requests between mall outlets or warehouses. The system tracks items in transit, requires digital dispatch & receipt confirmation, and updates both store inventories automatically.',
  },
  {
    q: 'Is there a free plan for solo founders and micro-shops?',
    a: 'Yes! Our Free Starter tier is 100% free forever for up to 3 team members. It includes real-time stock sync, mobile camera barcode billing, quotes, invoices, and basic operational dashboards with no credit card required.',
  },
  {
    q: 'How secure is our business and financial data?',
    a: 'Every transaction in GrowLabs is protected by AES-256 bank-grade encryption and logged to an immutable SHA-256 cryptographic Merkle ledger. We support SOC 2 Type II controls, daily automated cloud backups, and multi-tenant data isolation.',
  },
]

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section id="faq" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/3 left-10 -z-10 size-96 rounded-full bg-primary/10 blur-[130px]" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Got Questions?"
          title={
            <>
              Everything you need to know about{' '}
              <span className="text-gradient">GrowLabs & rental pricing</span>
            </>
          }
          description="Clear answers about hardware compatibility, flexible rental subscriptions, and industry-specific workflows."
        />

        <div className="mt-14 space-y-3.5">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <div
                  onClick={() => toggle(i)}
                  className={cn(
                    'group relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 backdrop-blur-xl',
                    isOpen
                      ? 'border-primary/50 bg-card/80 shadow-xl shadow-primary/10'
                      : 'border-white/5 bg-card/40 hover:border-white/20 hover:bg-card/60'
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {faq.q}
                    </h3>
                    <div
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-xl border transition-colors',
                        isOpen
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-white/10 bg-white/[0.03] text-muted-foreground group-hover:border-white/20'
                      )}
                    >
                      {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3.5 border-t border-white/5 pt-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

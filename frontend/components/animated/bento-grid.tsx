'use client'

import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export function BentoGrid({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  )
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
  badge,
  onClick,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
  badge?: string | React.ReactNode
  onClick?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'group/bento relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 flex flex-col justify-between space-y-4',
        className
      )}
    >
      {/* Dynamic hover gradient overlay */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/15 via-transparent to-accent/15 opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100" />

      {/* Header graphic / visual */}
      <div className="relative z-10 w-full overflow-hidden rounded-xl">
        {header}
      </div>

      {/* Item info */}
      <div className="relative z-10 space-y-2 transition duration-200 group-hover/bento:translate-x-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="flex size-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div className="font-display font-semibold text-foreground text-base">
              {title}
            </div>
          </div>
          {badge && (
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

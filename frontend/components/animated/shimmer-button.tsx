'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends HTMLMotionProps<'button'> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export function ShimmerButton({
  shimmerColor = 'rgba(255, 255, 255, 0.35)',
  shimmerSize = '0.08em',
  shimmerDuration = '2.5s',
  borderRadius = '100px',
  background = 'radial-gradient(ellipse 80% 50% at 50% 120%, oklch(0.62 0.185 262), oklch(0.24 0.05 264))',
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      style={
        {
          '--spread': '90deg',
          '--shimmer-color': shimmerColor,
          '--radius': borderRadius,
          '--speed': shimmerDuration,
          '--cut': shimmerSize,
          '--bg': background,
        } as React.CSSProperties
      }
      className={cn(
        'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/15 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40',
        className
      )}
      {...props}
    >
      {/* Sparkle container */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [border-radius:var(--radius)]"
      >
        <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] group-hover:[animation-duration:1.5s]" />
      </div>

      {/* Backdrop fill */}
      <div
        aria-hidden="true"
        className="absolute inset-[1px] -z-10 [border-radius:calc(var(--radius)-1px)] [background:var(--bg)] transition-colors duration-300 group-hover:brightness-110"
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 text-sm font-semibold tracking-wide">
        {children}
      </span>
    </motion.button>
  )
}

'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children: React.ReactNode
  vertical?: boolean
  repeat?: number
  speed?: 'slow' | 'normal' | 'fast'
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = true,
  children,
  vertical = false,
  repeat = 4,
  speed = 'normal',
}: MarqueeProps) {
  const durationMap = {
    slow: '60s',
    normal: '35s',
    fast: '20s',
  }

  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2 [--gap:1.5rem] [gap:var(--gap)]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className
      )}
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
            'animate-marquee flex-row': !vertical,
            'animate-marquee-vertical flex-col': vertical,
            '[animation-direction:reverse]': reverse,
            'group-hover:[animation-play-state:paused]': pauseOnHover,
          })}
          style={{
            animationDuration: durationMap[speed],
          }}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

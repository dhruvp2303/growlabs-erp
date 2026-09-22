import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-5 text-primary-foreground">
        <path
          d="M5 16.5V13m0 3.5L9 12l3.5 3L19 7.5"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="19" cy="7.5" r="1.9" fill="currentColor" />
      </svg>
    </span>
  )
}

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark />
      {showWordmark && (
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          Grow<span className="text-accent">Labs</span>
        </span>
      )}
    </span>
  )
}

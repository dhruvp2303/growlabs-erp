'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Building2, Check, Loader2, Lock, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { BrandAside } from '@/components/onboarding/brand-aside'
import { useOnboarding, type CompanySize } from '@/lib/onboarding/store'
import { cn } from '@/lib/utils'

const sizes: { value: CompanySize; label: string }[] = [
  { value: '1-10', label: '1–10' },
  { value: '11-50', label: '11–50' },
  { value: '51-200', label: '51–200' },
  { value: '201-1000', label: '201–1000' },
  { value: '1000+', label: '1000+' },
]

const roles = ['Founder / CEO', 'Operations', 'Finance', 'Supply Chain', 'IT / Systems', 'Other']

const steps = ['Account', 'Company', 'Confirm']

export default function SignupPage() {
  const router = useRouter()
  const { state, update, markStep } = useOnboarding()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validateStep(): boolean {
    const e: Record<string, string> = {}
    if (step === 0) {
      if (!state.fullName.trim()) e.fullName = 'Enter your name'
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email)) e.email = 'Enter a valid work email'
      if (state.password.length < 8) e.password = 'At least 8 characters'
    }
    if (step === 1) {
      if (!state.companyName.trim()) e.companyName = 'Enter your company name'
      if (!state.role) e.role = 'Select your role'
      if (!state.companySize) e.companySize = 'Select company size'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (!validateStep()) return
    if (step < steps.length - 1) {
      setDir(1)
      setStep((s) => s + 1)
    }
  }

  function back() {
    setDir(-1)
    setStep((s) => Math.max(0, s - 1))
  }

  async function finish() {
    setSubmitting(true)
    markStep('signup')
    await new Promise((r) => setTimeout(r, 1100))
    router.push('/onboarding/discovery')
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,440px)_1fr]">
      <BrandAside
        eyebrow="Get Started"
        title="Let's build an ERP that fits how you actually work."
        points={[
          'No credit card required to start',
          'Personalized setup in minutes, not months',
          'Switch on modules as your operation grows',
        ]}
      />

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between lg:hidden">
          <Link href="/" aria-label="GrowLabs home">
            <Logo />
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          {/* stepper */}
          <div className="mb-8 flex items-center gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                      i < step && 'bg-primary text-primary-foreground',
                      i === step && 'border-2 border-primary text-primary',
                      i > step && 'border border-border text-muted-foreground',
                    )}
                  >
                    {i < step ? <Check className="size-3.5" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      i <= step ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      'h-px flex-1 transition-colors',
                      i < step ? 'bg-primary' : 'bg-border',
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -24 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              {step === 0 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">Create your account</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Start your free GrowLabs workspace.
                  </p>

                  <div className="mt-6 flex flex-col gap-4">
                    <Field
                      label="Full name"
                      icon={<User className="size-4" />}
                      error={errors.fullName}
                    >
                      <input
                        value={state.fullName}
                        onChange={(e) => update({ fullName: e.target.value })}
                        placeholder="Jordan Reyes"
                        className="field-input"
                      />
                    </Field>
                    <Field
                      label="Work email"
                      icon={<Mail className="size-4" />}
                      error={errors.email}
                    >
                      <input
                        type="email"
                        value={state.email}
                        onChange={(e) => update({ email: e.target.value })}
                        placeholder="you@company.com"
                        className="field-input"
                      />
                    </Field>
                    <Field
                      label="Password"
                      icon={<Lock className="size-4" />}
                      error={errors.password}
                    >
                      <input
                        type="password"
                        value={state.password}
                        onChange={(e) => update({ password: e.target.value })}
                        placeholder="At least 8 characters"
                        className="field-input"
                      />
                    </Field>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">Tell us about your company</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    This helps us tailor your workspace.
                  </p>

                  <div className="mt-6 flex flex-col gap-4">
                    <Field
                      label="Company name"
                      icon={<Building2 className="size-4" />}
                      error={errors.companyName}
                    >
                      <input
                        value={state.companyName}
                        onChange={(e) => update({ companyName: e.target.value })}
                        placeholder="PrimeFlow Manufacturing"
                        className="field-input"
                      />
                    </Field>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Your role</label>
                      <div className="flex flex-wrap gap-2">
                        {roles.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => update({ role: r })}
                            className={cn(
                              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
                              state.role === r
                                ? 'border-primary bg-primary/10 text-foreground'
                                : 'border-border text-muted-foreground hover:border-primary/40',
                            )}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                      {errors.role && <p className="mt-1.5 text-xs text-destructive">{errors.role}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Company size</label>
                      <div className="grid grid-cols-5 gap-2">
                        {sizes.map((s) => (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() => update({ companySize: s.value })}
                            className={cn(
                              'rounded-lg border py-2 text-sm transition-colors',
                              state.companySize === s.value
                                ? 'border-primary bg-primary/10 text-foreground'
                                : 'border-border text-muted-foreground hover:border-primary/40',
                            )}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                      {errors.companySize && (
                        <p className="mt-1.5 text-xs text-destructive">{errors.companySize}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">You&apos;re all set</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Next, we&apos;ll learn about your operation and design your ERP.
                  </p>

                  <div className="mt-6 rounded-2xl border border-border bg-card/40 p-5">
                    <Summary label="Name" value={state.fullName} />
                    <Summary label="Email" value={state.email} />
                    <Summary label="Company" value={state.companyName} />
                    <Summary label="Role" value={state.role} />
                    <Summary label="Size" value={state.companySize ?? ''} last />
                  </div>

                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/[0.06] p-4">
                    <div className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <ArrowRight className="size-3.5" />
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Our AI discovery will ask a few questions, then assemble a personalized ERP
                      recommendation for {state.companyName || 'your company'}.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* nav */}
          <div className="mt-8 flex items-center gap-3">
            {step > 0 && (
              <Button variant="outline" size="lg" className="h-11" onClick={back}>
                <ArrowLeft className="size-4" data-icon="inline-start" />
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button size="lg" className="h-11 flex-1" onClick={next}>
                Continue
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
            ) : (
              <Button size="lg" className="h-11 flex-1" onClick={finish} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                    Creating workspace…
                  </>
                ) : (
                  <>
                    Start Discovery
                    <ArrowRight className="size-4" data-icon="inline-end" />
                  </>
                )}
              </Button>
            )}
          </div>

          {step === 0 && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string
  icon: React.ReactNode
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <div
        className={cn(
          'flex items-center gap-2.5 rounded-lg border bg-background/60 px-3 transition-colors focus-within:border-primary',
          error ? 'border-destructive' : 'border-border',
        )}
      >
        <span className="text-muted-foreground">{icon}</span>
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  )
}

function Summary({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between py-2.5 text-sm',
        !last && 'border-b border-border',
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value || '—'}</span>
    </div>
  )
}

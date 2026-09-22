'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Mail, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { BrandAside } from '@/components/onboarding/brand-aside'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validateForm(): boolean {
    const e: Record<string, string> = {}
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      e.email = 'Enter a valid email'
    }
    if (password.length < 8) {
      e.password = 'Password must be at least 8 characters'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    
    // Mock auth delay
    await new Promise((r) => setTimeout(r, 1200))

    // In production, this would call a real auth API
    // For now, we simulate successful login
    if (rememberMe) {
      localStorage.setItem('growlabs_email', email)
    }

    // Redirect to dashboard
    router.push('/dashboard')
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,440px)_1fr]">
      <BrandAside
        eyebrow="Welcome Back"
        title="Access your personalized ERP"
        points={[
          'Real-time business visibility',
          'AI-powered recommendations',
          'Manage all operations in one place',
        ]}
      />

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between lg:hidden">
          <Link href="/" aria-label="GrowLabs home">
            <Logo />
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-2xl font-bold">Log in to GrowLabs</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Access your ERP and manage your business
            </p>

            <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <div
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg border bg-background/60 px-3 transition-colors focus-within:border-primary',
                    errors.email ? 'border-destructive' : 'border-border',
                  )}
                >
                  <Mail className="size-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: '' })
                    }}
                    placeholder="you@company.com"
                    className="flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-muted-foreground"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">Password</label>
                <div
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg border bg-background/60 px-3 transition-colors focus-within:border-primary',
                    errors.password ? 'border-destructive' : 'border-border',
                  )}
                >
                  <Lock className="size-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: '' })
                    }}
                    placeholder="At least 8 characters"
                    className="flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '✓' : '○'}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border border-border bg-background transition-colors checked:border-primary checked:bg-primary"
                  />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <Link
                  href="#"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button size="lg" className="h-11 mt-6" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Log In
                    <ArrowRight className="size-4" data-icon="inline-end" />
                  </>
                )}
              </Button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

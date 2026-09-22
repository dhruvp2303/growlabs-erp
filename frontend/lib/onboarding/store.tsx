'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type CompanySize = '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'

export type IndustryId =
  | 'manufacturing'
  | 'distribution'
  | 'retail'
  | 'agriculture'
  | 'construction'
  | 'services'

export type ModuleId =
  | 'inventory'
  | 'sales'
  | 'production'
  | 'procurement'
  | 'finance'
  | 'analytics'
  | 'hr'
  | 'quality'
  | 'logistics'

export type Priority = 'inventory' | 'cost' | 'growth' | 'compliance' | 'visibility' | 'automation'

export interface OnboardingState {
  // account
  fullName: string
  email: string
  password: string
  // company
  companyName: string
  role: string
  companySize: CompanySize | null
  industry: IndustryId | null
  // discovery
  goals: string
  painPoints: string[]
  priorities: Priority[]
  currentTools: string[]
  monthlyOrders: string
  teamCount: string
  // requirements
  selectedModules: ModuleId[]
  // industry details
  industryDetails: Record<string, any>
  // meta
  completedSteps: string[]
}

const DEFAULT_STATE: OnboardingState = {
  fullName: '',
  email: '',
  password: '',
  companyName: '',
  role: '',
  companySize: null,
  industry: null,
  goals: '',
  painPoints: [],
  priorities: [],
  currentTools: [],
  monthlyOrders: '',
  teamCount: '',
  selectedModules: [],
  industryDetails: {},
  completedSteps: [],
}

const STORAGE_KEY = 'growlabs.onboarding'

interface OnboardingContextValue {
  state: OnboardingState
  update: (patch: Partial<OnboardingState>) => void
  toggleInArray: <K extends keyof OnboardingState>(key: K, value: string) => void
  markStep: (step: string) => void
  reset: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) })
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state, hydrated])

  const update = useCallback((patch: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...patch }))
  }, [])

  const toggleInArray = useCallback(
    <K extends keyof OnboardingState>(key: K, value: string) => {
      setState((prev) => {
        const arr = (prev[key] as unknown as string[]) ?? []
        const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
        return { ...prev, [key]: next }
      })
    },
    [],
  )

  const markStep = useCallback((step: string) => {
    setState((prev) =>
      prev.completedSteps.includes(step)
        ? prev
        : { ...prev, completedSteps: [...prev.completedSteps, step] },
    )
  }, [])

  const reset = useCallback(() => setState(DEFAULT_STATE), [])

  const value = useMemo(
    () => ({ state, update, toggleInArray, markStep, reset }),
    [state, update, toggleInArray, markStep, reset],
  )

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}

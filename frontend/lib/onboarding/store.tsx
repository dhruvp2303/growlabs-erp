'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type CompanySize = '1-5 (Micro/Solo)' | '6-20 (Small Team)' | '21-100 (Growing)' | '101-500 (Mid-Enterprise)' | '500+ (Industrial Scale)'

export type IndustryId =
  | 'retail_shop'
  | 'supermarket'
  | 'mall_store'
  | 'clothing'
  | 'restaurant'
  | 'services'
  | 'distribution'
  | 'manufacturing'
  | 'pharmacy'
  | 'automobile'
  | 'agriculture'
  | 'construction'
  | 'jewelry'
  | 'library'
  | 'costume_rental'
  | 'equipment_rental'
  | 'event_rental'
  | 'other'

export type ModuleId =
  | 'pos'
  | 'inventory'
  | 'sales'
  | 'production'
  | 'procurement'
  | 'finance'
  | 'analytics'
  | 'hr'
  | 'quality'
  | 'logistics'
  | 'recipes'
  | 'whatsapp'
  | 'rental_ops'
  | 'custom_features'

export type Priority = 'pos' | 'inventory' | 'cost' | 'growth' | 'compliance' | 'visibility' | 'automation' | 'recipes' | 'rentals' | 'custom'

export type RentalDuration = '30_days' | '3_months' | '6_months' | '1_year'

export interface CustomFeature {
  id: string
  title: string
  description: string
  category: string
  schemaFields: string[]
  status: 'ACTIVE' | 'DRAFT'
  createdAt: string
}

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
  customIndustryName?: string
  // rental duration
  rentalDuration: RentalDuration
  trialActive: boolean
  // discovery
  goals: string
  painPoints: string[]
  priorities: Priority[]
  currentTools: string[]
  monthlyOrders: string
  teamCount: string
  // requirements
  selectedModules: ModuleId[]
  customFeatures: CustomFeature[]
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
  customIndustryName: '',
  rentalDuration: '30_days',
  trialActive: true,
  goals: '',
  painPoints: [],
  priorities: [],
  currentTools: [],
  monthlyOrders: '',
  teamCount: '',
  selectedModules: [],
  customFeatures: [],
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

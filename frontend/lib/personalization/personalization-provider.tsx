'use client'

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { IndustryType, IndustryProfile, INDUSTRY_PROFILES } from './industry-profiles'

export type UiDensity = 'compact' | 'comfortable' | 'dense'

interface PersonalizationState {
  activeIndustry: IndustryType
  density: UiDensity
  companyName: string
  accentColorOverride?: string
  enableAiAutopilot: boolean
  enableSoundEffects: boolean
  customDomain?: string
}

interface PersonalizationContextValue {
  state: PersonalizationState
  profile: IndustryProfile
  setIndustry: (industry: IndustryType) => void
  setDensity: (density: UiDensity) => void
  setCompanyName: (name: string) => void
  setAccentColorOverride: (color?: string) => void
  toggleAiAutopilot: () => void
  t: (key: keyof IndustryProfile['terminology']) => string
  resetPersonalization: () => void
}

const STORAGE_KEY = 'growlabs.personalization.v2'

const DEFAULT_STATE: PersonalizationState = {
  activeIndustry: 'manufacturing',
  density: 'comfortable',
  companyName: 'PrimeFlow Precision Robotics Ltd.',
  enableAiAutopilot: true,
  enableSoundEffects: false,
}

const PersonalizationContext = createContext<PersonalizationContextValue | null>(null)

export function PersonalizationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersonalizationState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setState({ ...DEFAULT_STATE, ...JSON.parse(saved) })
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  // Persist to local storage
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state, hydrated])

  const profile = useMemo(() => {
    return INDUSTRY_PROFILES[state.activeIndustry] || INDUSTRY_PROFILES.manufacturing
  }, [state.activeIndustry])

  const setIndustry = useCallback((industry: IndustryType) => {
    const targetProfile = INDUSTRY_PROFILES[industry]
    setState((prev) => ({
      ...prev,
      activeIndustry: industry,
      companyName: targetProfile.demoCompanyName,
    }))
  }, [])

  const setDensity = useCallback((density: UiDensity) => {
    setState((prev) => ({ ...prev, density }))
  }, [])

  const setCompanyName = useCallback((companyName: string) => {
    setState((prev) => ({ ...prev, companyName }))
  }, [])

  const setAccentColorOverride = useCallback((accentColorOverride?: string) => {
    setState((prev) => ({ ...prev, accentColorOverride }))
  }, [])

  const toggleAiAutopilot = useCallback(() => {
    setState((prev) => ({ ...prev, enableAiAutopilot: !prev.enableAiAutopilot }))
  }, [])

  const t = useCallback(
    (key: keyof IndustryProfile['terminology']) => {
      return profile.terminology[key] || key
    },
    [profile]
  )

  const resetPersonalization = useCallback(() => {
    setState(DEFAULT_STATE)
  }, [])

  const value = useMemo(
    () => ({
      state,
      profile,
      setIndustry,
      setDensity,
      setCompanyName,
      setAccentColorOverride,
      toggleAiAutopilot,
      t,
      resetPersonalization,
    }),
    [
      state,
      profile,
      setIndustry,
      setDensity,
      setCompanyName,
      setAccentColorOverride,
      toggleAiAutopilot,
      t,
      resetPersonalization,
    ]
  )

  return (
    <PersonalizationContext.Provider value={value}>
      <div
        data-density={state.density}
        data-industry={state.activeIndustry}
        className="min-h-screen w-full transition-colors duration-300"
      >
        {children}
      </div>
    </PersonalizationContext.Provider>
  )
}

export function usePersonalization() {
  const ctx = useContext(PersonalizationContext)
  if (!ctx) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider')
  }
  return ctx
}

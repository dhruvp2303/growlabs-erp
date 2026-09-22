'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  Palette,
  Layers,
  Building,
  Check,
  Zap,
  Sliders,
  X,
  RefreshCw,
  Cpu,
  Globe,
  ShieldCheck,
} from 'lucide-react'
import { usePersonalization } from '@/lib/personalization/personalization-provider'
import { INDUSTRY_PROFILES, IndustryType } from '@/lib/personalization/industry-profiles'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PersonalizationStudioModalProps {
  open: boolean
  onClose: () => void
}

export function PersonalizationStudioModal({ open, onClose }: PersonalizationStudioModalProps) {
  const {
    state,
    profile,
    setIndustry,
    setDensity,
    setCompanyName,
    toggleAiAutopilot,
    resetPersonalization,
  } = usePersonalization()

  const [localCompanyName, setLocalCompanyName] = useState(state.companyName)

  if (!open) return null

  const handleSelectIndustry = (type: IndustryType) => {
    setIndustry(type)
    const newProfile = INDUSTRY_PROFILES[type]
    setLocalCompanyName(newProfile.demoCompanyName)
    toast.success(`ERP Personalized for ${newProfile.name}!`, {
      description: `All terminologies, KPIs, and pipelines morphed to ${newProfile.badge}.`,
    })
  }

  const handleSaveBrand = () => {
    setCompanyName(localCompanyName)
    toast.success('Tenant Brand Settings Saved')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl border border-primary/30 bg-card/95 shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center border border-primary/30">
              <Palette className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display text-foreground">
                  Hyper-Personalization & Industry Studio
                </h2>
                <Badge className="bg-primary/20 text-primary border-primary/40 font-mono text-[10px]">
                  PRO ARCHITECTURE
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Morph your GrowLabs ERP instance into an industry-tailored enterprise solution.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Section 1: Industry Archetype Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Cpu className="size-4 text-primary" /> Select Tailored Industry Engine
                </h3>
                <p className="text-xs text-muted-foreground">
                  Instantly adapts data schemas, terminology, specialized telemetry, and visual themes.
                </p>
              </div>
              <Badge variant="outline" className="text-[11px] font-mono">
                Active: {profile.badge}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(Object.keys(INDUSTRY_PROFILES) as IndustryType[]).map((key) => {
                const item = INDUSTRY_PROFILES[key]
                const isSelected = state.activeIndustry === key

                return (
                  <button
                    key={key}
                    onClick={() => handleSelectIndustry(key)}
                    className={cn(
                      'relative text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group overflow-hidden',
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5 ring-1 ring-primary'
                        : 'border-border bg-card/40 hover:border-primary/40 hover:bg-muted/30'
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px] font-semibold py-0.5',
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {item.badge}
                        </Badge>
                        {isSelected && (
                          <div className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="size-3" />
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-sm font-display text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.tagline}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                      <span>{item.complianceBadges[0]}</span>
                      <span className="font-semibold text-primary">Live Schemas &rarr;</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 2: Terminology Preview Matrix */}
          <div className="rounded-2xl border border-border bg-card/30 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="size-4 text-primary" /> Active Nomenclature & Terminology Morphing
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-background/50 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Standard Product</span>
                <span className="font-semibold text-primary font-mono mt-0.5 block">{profile.terminology.products}</span>
              </div>
              <div className="p-3 rounded-xl bg-background/50 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Standard Order</span>
                <span className="font-semibold text-primary font-mono mt-0.5 block">{profile.terminology.orders}</span>
              </div>
              <div className="p-3 rounded-xl bg-background/50 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Customer Entity</span>
                <span className="font-semibold text-primary font-mono mt-0.5 block">{profile.terminology.customers}</span>
              </div>
              <div className="p-3 rounded-xl bg-background/50 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Pipeline Queue</span>
                <span className="font-semibold text-primary font-mono mt-0.5 block">{profile.terminology.pipelineName}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Density & Tenant Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Density */}
            <div className="rounded-2xl border border-border bg-card/30 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sliders className="size-4 text-primary" /> UI Density & Terminal Display
              </h3>
              <p className="text-xs text-muted-foreground">
                Choose spacing density for maximum information velocity or modern spaciousness.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {(['comfortable', 'compact', 'dense'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    className={cn(
                      'py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all',
                      state.density === d
                        ? 'border-primary bg-primary text-primary-foreground font-bold shadow'
                        : 'border-border bg-background hover:border-primary/40'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Tenant White-Label */}
            <div className="rounded-2xl border border-border bg-card/30 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Building className="size-4 text-primary" /> Tenant White-Label Name
              </h3>
              <p className="text-xs text-muted-foreground">
                Set your custom enterprise organization name across all navigation headers and reports.
              </p>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={localCompanyName}
                  onChange={(e) => setLocalCompanyName(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary font-medium"
                />
                <Button size="sm" onClick={handleSaveBrand} className="text-xs">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-background/50">
          <button
            onClick={resetPersonalization}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="size-3.5" /> Reset to Defaults
          </button>
          <Button onClick={onClose} className="px-6 font-semibold">
            Apply & Close Studio
          </Button>
        </div>
      </div>
    </div>
  )
}

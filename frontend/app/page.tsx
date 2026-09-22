import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { ProblemSolution } from '@/components/landing/problem-solution'
import { Platform } from '@/components/landing/platform'
import { AiSection } from '@/components/landing/ai-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Industries } from '@/components/landing/industries'
import { Pricing } from '@/components/landing/pricing'
import { Testimonials } from '@/components/landing/testimonials'
import { FinalCta } from '@/components/landing/final-cta'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <Platform />
        <AiSection />
        <HowItWorks />
        <Industries />
        <Pricing />
        <Testimonials />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}

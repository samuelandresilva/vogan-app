import { useEffect, useRef, type PropsWithChildren } from 'react'
import { useLocation } from 'react-router-dom'
import type { DadosEmpresa } from '../../types'
import { DadosEmpresaCard } from './DadosEmpresaCard'
import { HeaderOakbeard } from './HeaderOakbeard'
import { type BookingStep, StepIndicator } from './StepIndicator'

interface AppLayoutProps extends PropsWithChildren {
  dadosEmpresa: DadosEmpresa
  currentStep?: BookingStep
}

export function AppLayout({
  dadosEmpresa,
  children,
  currentStep,
}: AppLayoutProps) {
  const location = useLocation()
  const stepSectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!currentStep) {
      return
    }

    stepSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [currentStep, location.pathname])

  return (
    <div className="min-h-dvh bg-transparent text-[#3f3437]">
      <HeaderOakbeard />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-5 sm:px-5 sm:py-7">
        <DadosEmpresaCard dadosEmpresa={dadosEmpresa} />
        {currentStep ? <StepIndicator currentStep={currentStep} /> : null}
        <section
          ref={stepSectionRef}
          className="min-h-80 scroll-mt-4 rounded-md border border-[#f3d4dc] bg-white/90 p-4 shadow-xl shadow-[#3f3437]/10 sm:p-5"
        >
          {children}
        </section>
      </main>
    </div>
  )
}

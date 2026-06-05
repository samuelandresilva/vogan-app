import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout, AppHeader } from '../../components/layout'
import { getDadosEmpresa } from '../../services/googleSheetsService'
import type { DadosEmpresa } from '../../types'

export function HomePage() {
  const navigate = useNavigate()
  const [empresa, setDadosEmpresa] = useState<DadosEmpresa | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDadosEmpresa() {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const loadedDadosEmpresa = await getDadosEmpresa()

        if (isMounted) {
          setDadosEmpresa(loadedDadosEmpresa)
        }
      } catch {
        if (isMounted) {
          setErrorMessage(
            'Não foi possível carregar as informações do estabelecimento.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadDadosEmpresa()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-transparent text-[#3f3437]">
        <AppHeader />
        <main className="mx-auto w-full max-w-5xl px-5 py-8">
          <p className="rounded-md border border-[#f3d4dc] bg-white p-4 text-sm text-[#7b666d]">
            Carregando informações...
          </p>
        </main>
      </div>
    )
  }

  if (errorMessage || !empresa) {
    return (
      <div className="min-h-dvh bg-transparent text-[#3f3437]">
        <AppHeader />
        <main className="mx-auto w-full max-w-5xl px-5 py-8">
          <div className="rounded-md border border-[#f0c8cf] bg-[#fff5f6] p-4">
            <p className="text-sm text-[#9f5d68]">
              {errorMessage ||
                'Não foi possível carregar as informações do estabelecimento.'}
            </p>
            <button
              type="button"
              className="mt-4 min-h-11 rounded bg-[#d88ca4] px-4 text-sm font-semibold text-white"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <AppLayout dadosEmpresa={empresa}>
      <div className="flex min-h-72 flex-col justify-center gap-6">
        <div>
          <p className="text-sm font-bold uppercase text-[#c97891]">
            Agendamento
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold text-[#3f3437] sm:text-4xl">
            Agende seu momento com praticidade.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#7b666d]">
            Veja os serviços, escolha um profissional e encontre o melhor horário para seu atendimento.
          </p>
        </div>

        <div>
          <button
            type="button"
            className="min-h-12 rounded-md bg-[#d88ca4] px-5 text-sm font-bold text-white shadow-lg shadow-[#3f3437]/15 transition hover:bg-[#c97891]"
            onClick={() => navigate('/servicos')}
          >
            Agendar Horário
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout, HeaderOakbeard } from '../../components/layout'
import { useBooking } from '../../contexts'
import { getDadosEmpresa } from '../../services/googleSheetsService'
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  openWhatsAppUrl,
} from '../../services/whatsappService'
import type { DadosEmpresa } from '../../types'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  style: 'currency',
})

function formatDate(data: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${data}T00:00:00`))
}

export function ReviewPage() {
  const navigate = useNavigate()
  const {
    profissionalSelecionado,
    data,
    horario,
    nomeCliente,
    servicoSelecionado,
    telefoneCliente,
  } = useBooking()
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

  if (
    !servicoSelecionado ||
    !profissionalSelecionado ||
    !data ||
    !horario ||
    !nomeCliente ||
    !telefoneCliente
  ) {
    return (
      <div className="min-h-dvh bg-transparent text-[#3f3437]">
        <HeaderOakbeard />
        <main className="mx-auto w-full max-w-5xl px-5 py-8">
          <div className="rounded-md border border-[#f3d4dc] bg-white p-4">
            <p className="text-sm text-[#7b666d]">
              Complete as etapas anteriores antes de revisar a solicitação.
            </p>
            <button
              type="button"
              className="mt-4 min-h-11 rounded bg-[#d88ca4] px-4 text-sm font-semibold text-white"
              onClick={() => navigate('/servicos')}
            >
              Voltar ao início do fluxo
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-transparent text-[#3f3437]">
        <HeaderOakbeard />
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
        <HeaderOakbeard />
        <main className="mx-auto w-full max-w-5xl px-5 py-8">
          <p className="rounded-md border border-[#f0c8cf] bg-[#fff5f6] p-4 text-sm text-[#9f5d68]">
            {errorMessage ||
              'Não foi possível carregar as informações do estabelecimento.'}
          </p>
        </main>
      </div>
    )
  }

  const confirmedDadosEmpresa = empresa
  const bookingDetails = {
    profissional: profissionalSelecionado,
    data,
    horario,
    nomeCliente,
    servico: servicoSelecionado,
    telefoneCliente,
  }

  function handleBookingRequest() {
    const message = buildWhatsAppMessage(bookingDetails)
    const whatsappUrl = buildWhatsAppUrl({
      message,
      telefoneWhatsapp: confirmedDadosEmpresa.telefoneWhatsapp,
    })

    openWhatsAppUrl(whatsappUrl)
    navigate('/whatsapp')
  }

  return (
    <AppLayout dadosEmpresa={empresa} currentStep="revisao">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-semibold text-[#3f3437]">
            Revise sua solicitação
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#7b666d]">
            Confira os dados antes de enviar.
          </p>
        </div>

        <dl className="grid gap-3">
          <div className="rounded-md border border-[#f3d4dc] bg-white p-4 shadow-sm shadow-[#3f3437]/10">
            <dt className="text-xs font-semibold uppercase text-[#b98a99]">
              Serviço
            </dt>
            <dd className="mt-2 text-base font-semibold text-[#3f3437]">
              {servicoSelecionado.nome}
            </dd>
            <dd className="mt-1 text-sm text-[#7b666d]">
              {currencyFormatter.format(servicoSelecionado.preco)} -{' '}
              {servicoSelecionado.duracaoMinutos} min
            </dd>
          </div>

          <div className="rounded-md border border-[#f3d4dc] bg-white p-4 shadow-sm shadow-[#3f3437]/10">
            <dt className="text-xs font-semibold uppercase text-[#b98a99]">
              Profissional
            </dt>
            <dd className="mt-2 text-base font-semibold text-[#3f3437]">
              {profissionalSelecionado?.nome}
            </dd>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-[#f3d4dc] bg-white p-4 shadow-sm shadow-[#3f3437]/10">
              <dt className="text-xs font-semibold uppercase text-[#b98a99]">
                Data
              </dt>
              <dd className="mt-2 text-base font-semibold text-[#3f3437]">
                {formatDate(data)}
              </dd>
            </div>

            <div className="rounded-md border border-[#f3d4dc] bg-white p-4 shadow-sm shadow-[#3f3437]/10">
              <dt className="text-xs font-semibold uppercase text-[#b98a99]">
                Horário
              </dt>
              <dd className="mt-2 text-base font-semibold text-[#3f3437]">
                {horario}
              </dd>
            </div>
          </div>

          <div className="rounded-md border border-[#f3d4dc] bg-white p-4 shadow-sm shadow-[#3f3437]/10">
            <dt className="text-xs font-semibold uppercase text-[#b98a99]">
              Cliente
            </dt>
            <dd className="mt-2 text-base font-semibold text-[#3f3437]">
              {nomeCliente}
            </dd>
            <dd className="mt-1 text-sm text-[#7b666d]">{telefoneCliente}</dd>
          </div>
        </dl>

        <p className="rounded-md border border-[#f3d4dc] bg-[#fff7f8] p-4 text-sm leading-6 text-[#7b666d]">
          Sua solicitação será enviada para o estabelecimento. 
          O agendamento será confirmado manualmente pela equipe.
        </p>

        <div className="flex justify-between gap-3">
          <button
            type="button"
            className="min-h-12 rounded-md border border-[#f3d4dc] bg-white px-5 text-sm font-semibold text-[#7b666d] transition hover:border-[#d8a5b5]"
            onClick={() => navigate('/cliente')}
          >
            Voltar
          </button>
          <button
            type="button"
            className="min-h-12 rounded-md bg-[#d88ca4] px-5 text-sm font-bold text-white shadow-lg shadow-[#3f3437]/15 transition hover:bg-[#c97891]"
            onClick={handleBookingRequest}
          >
            Solicitar Agendamento
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

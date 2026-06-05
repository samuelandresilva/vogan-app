import { type ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout, HeaderOakbeard } from '../../components/layout'
import { useBooking } from '../../contexts'
import { getDadosEmpresa } from '../../services/googleSheetsService'
import type { DadosEmpresa } from '../../types'

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : ''
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function isValidPhone(value: string) {
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(value)
}

export function CustomerPage() {
  const navigate = useNavigate()
  const {
    profissionalSelecionado,
    data,
    horario,
    nomeCliente,
    servicoSelecionado,
    setNomeCliente,
    setTelefoneCliente,
    telefoneCliente,
  } = useBooking()
  const [empresa, setDadosEmpresa] = useState<DadosEmpresa | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const isNameValid = useMemo(
    () => nomeCliente.trim().length >= 3,
    [nomeCliente],
  )
  const isPhoneValid = useMemo(
    () => isValidPhone(telefoneCliente),
    [telefoneCliente],
  )
  const isFormValid = isNameValid && isPhoneValid

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

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setNomeCliente(event.target.value)
  }

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    setTelefoneCliente(formatPhone(event.target.value))
  }

  if (!servicoSelecionado || !profissionalSelecionado || !data || !horario) {
    return (
      <div className="min-h-dvh bg-transparent text-[#3f3437]">
        <HeaderOakbeard />
        <main className="mx-auto w-full max-w-5xl px-5 py-8">
          <div className="rounded-md border border-[#f3d4dc] bg-white p-4">
            <p className="text-sm text-[#7b666d]">
              Complete as etapas anteriores antes de informar seus dados.
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

  return (
    <AppLayout dadosEmpresa={empresa} currentStep="dados">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-semibold text-[#3f3437]">
            Informe seus dados
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#7b666d]">
            Usaremos essas informações para confirmar a solicitação.
          </p>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#6f5a61]">Nome</span>
            <input
              type="text"
              className="min-h-12 rounded-md border border-[#f3d4dc] bg-white px-4 text-sm text-[#3f3437] outline-none shadow-inner shadow-[#3f3437]/10 transition focus:border-[#d88ca4]"
              value={nomeCliente}
              onChange={handleNameChange}
              placeholder="Seu nome"
            />
            {!isNameValid && nomeCliente.length > 0 ? (
              <span className="text-xs text-[#b66f87]">
                Informe pelo menos 3 caracteres.
              </span>
            ) : null}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#6f5a61]">
              Telefone
            </span>
            <input
              type="tel"
              inputMode="numeric"
              className="min-h-12 rounded-md border border-[#f3d4dc] bg-white px-4 text-sm text-[#3f3437] outline-none shadow-inner shadow-[#3f3437]/10 transition focus:border-[#d88ca4]"
              value={telefoneCliente}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
            />
            {!isPhoneValid && telefoneCliente.length > 0 ? (
              <span className="text-xs text-[#b66f87]">
                Use o formato (11) 99999-9999.
              </span>
            ) : null}
          </label>
        </div>

        <div className="flex justify-between gap-3">
          <button
            type="button"
            className="min-h-12 rounded-md border border-[#f3d4dc] bg-white px-5 text-sm font-semibold text-[#7b666d] transition hover:border-[#d8a5b5]"
            onClick={() => navigate('/horarios')}
          >
            Voltar
          </button>
          <button
            type="button"
            className="min-h-12 rounded-md bg-[#d88ca4] px-5 text-sm font-bold text-white shadow-lg shadow-[#3f3437]/15 transition enabled:hover:bg-[#c97891] disabled:cursor-not-allowed disabled:bg-[#f8e7ed] disabled:text-[#cdb5bd] disabled:shadow-none"
            disabled={!isFormValid}
            onClick={() => navigate('/revisao')}
          >
            Continuar
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

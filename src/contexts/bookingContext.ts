import { createContext } from 'react'
import type { Profissional, Servico } from '../types'

export interface BookingState {
  servicoSelecionado: Servico | null
  profissionalSelecionado: Profissional | null
  data: string
  horario: string
  nomeCliente: string
  telefoneCliente: string
}

export interface BookingContextValue extends BookingState {
  setServicoSelecionado: (servico: Servico | null) => void
  setProfissionalSelecionado: (profissional: Profissional | null) => void
  setData: (data: string) => void
  setHorario: (horario: string) => void
  setNomeCliente: (nomeCliente: string) => void
  setTelefoneCliente: (telefoneCliente: string) => void
  resetBooking: () => void
}

export const initialBookingState: BookingState = {
  servicoSelecionado: null,
  profissionalSelecionado: null,
  data: '',
  horario: '',
  nomeCliente: '',
  telefoneCliente: '',
}

export const BookingContext = createContext<BookingContextValue | undefined>(
  undefined,
)

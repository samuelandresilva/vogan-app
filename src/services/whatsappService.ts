import type { Profissional, Servico } from '../types'

interface BuildWhatsAppMessageParams {
  profissional: Profissional
  data: string
  horario: string
  nomeCliente: string
  servico: Servico
  telefoneCliente: string
}

interface BuildWhatsAppUrlParams {
  message: string
  telefoneWhatsapp: string
}

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

function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

export function buildWhatsAppMessage({
  profissional,
  data,
  horario,
  nomeCliente,
  servico,
  telefoneCliente,
}: BuildWhatsAppMessageParams) {
  return [
    'Olá, gostaria de solicitar um agendamento.',
    '',
    `Nome: ${nomeCliente}`,
    `Telefone: ${telefoneCliente}`,
    `Serviço: ${servico.nome}`,
    `Preço: ${currencyFormatter.format(servico.preco)}`,
    `Profissional: ${profissional.nome}`,
    `Data: ${formatDate(data)}`,
    `Horário: ${horario}`,
    '',
    'Entendo que o agendamento será confirmado manualmente pela equipe.',
  ].join('\n')
}

export function buildWhatsAppUrl({
  message,
  telefoneWhatsapp,
}: BuildWhatsAppUrlParams) {
  const phone = onlyDigits(telefoneWhatsapp)

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function openWhatsAppUrl(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

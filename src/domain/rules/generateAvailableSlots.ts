import type {
  AgendaProfissional,
  EventoOcupado,
  HorarioDisponivel,
  Servico,
} from '../../types'

interface GenerateAvailableSlotsParams {
  agenda: AgendaProfissional
  data: string
  eventosOcupados: EventoOcupado[]
  servico: Servico
}

function parseTimeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

function formatMinutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function buildDateTime(data: string, timeInMinutes: number) {
  return new Date(`${data}T${formatMinutesToTime(timeInMinutes)}:00`)
}

function formatDateToIso(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function isSlotBeforeNow(slotStart: Date, data: string) {
  const now = new Date()

  return data === formatDateToIso(now) && slotStart < now
}

function hasEventConflict(
  slotStart: Date,
  slotEnd: Date,
  eventosOcupados: EventoOcupado[],
) {
  return eventosOcupados.some(
    (evento) => slotStart < evento.fim && slotEnd > evento.inicio,
  )
}

export function generateAvailableSlots({
  agenda,
  data,
  eventosOcupados,
  servico,
}: GenerateAvailableSlotsParams): HorarioDisponivel[] {
  const startMinutes = parseTimeToMinutes(agenda.horaInicio)
  const endMinutes = parseTimeToMinutes(agenda.horaFim)
  const availableSlots: HorarioDisponivel[] = []

  for (
    let currentMinutes = startMinutes;
    currentMinutes + servico.duracaoMinutos <= endMinutes;
    currentMinutes += agenda.intervaloMinutos
  ) {
    const slotStart = buildDateTime(data, currentMinutes)
    const slotEnd = buildDateTime(data, currentMinutes + servico.duracaoMinutos)

    if (
      !isSlotBeforeNow(slotStart, data) &&
      !hasEventConflict(slotStart, slotEnd, eventosOcupados)
    ) {
      availableSlots.push({
        data,
        horario: formatMinutesToTime(currentMinutes),
      })
    }
  }

  return availableSlots
}

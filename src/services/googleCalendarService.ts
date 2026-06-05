import type { EventoOcupado } from '../types'

interface GetEventosOcupadosParams {
  data: string
  googleCalendarId: string
}

interface GoogleCalendarDateValue {
  date?: string
  dateTime?: string
}

interface GoogleCalendarEvent {
  end?: GoogleCalendarDateValue
  start?: GoogleCalendarDateValue
  status?: string
}

interface GoogleCalendarEventsResponse {
  items?: GoogleCalendarEvent[]
}

const calendarTimeZone = 'America/Sao_Paulo'
const saoPauloOffset = '-03:00'

function getCalendarApiKey() {
  const apiKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY

  if (!apiKey) {
    throw new Error('Google Calendar API não configurada.')
  }

  return apiKey
}

function buildDayStart(data: string) {
  return `${data}T00:00:00${saoPauloOffset}`
}

function buildDayEnd(data: string) {
  return `${data}T23:59:59${saoPauloOffset}`
}

function buildCalendarEventsUrl({
  data,
  googleCalendarId,
}: GetEventosOcupadosParams) {
  const searchParams = new URLSearchParams({
    fields: 'items(status,start,end)',
    key: getCalendarApiKey(),
    orderBy: 'startTime',
    showDeleted: 'false',
    singleEvents: 'true',
    timeMax: buildDayEnd(data),
    timeMin: buildDayStart(data),
    timeZone: calendarTimeZone,
  })

  return `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    googleCalendarId,
  )}/events?${searchParams.toString()}`
}

function buildDateFromAllDayValue(date: string) {
  return new Date(`${date}T00:00:00${saoPauloOffset}`)
}

function mapCalendarEventToBusyPeriod(
  event: GoogleCalendarEvent,
): EventoOcupado | null {
  if (event.status === 'cancelled' || !event.start || !event.end) {
    return null
  }

  if (event.start.date && event.end.date) {
    return {
      inicio: buildDateFromAllDayValue(event.start.date),
      fim: buildDateFromAllDayValue(event.end.date),
    }
  }

  if (event.start.dateTime && event.end.dateTime) {
    return {
      inicio: new Date(event.start.dateTime),
      fim: new Date(event.end.dateTime),
    }
  }

  return null
}

export async function getEventosOcupados({
  data,
  googleCalendarId,
}: GetEventosOcupadosParams): Promise<EventoOcupado[]> {
  try {
    const response = await fetch(
      buildCalendarEventsUrl({ data, googleCalendarId }),
    )

    if (!response.ok) {
      throw new Error('Falha ao consultar Google Calendar.')
    }

    const calendarEvents =
      (await response.json()) as GoogleCalendarEventsResponse

    return (calendarEvents.items ?? []).flatMap((event) => {
      const busyPeriod = mapCalendarEventToBusyPeriod(event)

      return busyPeriod ? [busyPeriod] : []
    })
  } catch {
    throw new Error('Não foi possível consultar a disponibilidade do profissional.')
  }
}

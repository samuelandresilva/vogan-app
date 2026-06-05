import type {
  AgendaProfissional,
  DadosEmpresa,
  Profissional,
  Servico,
} from '../types'
import type { ProfissionalServico } from '../types/ProfissionalServico'

export interface GoogleSheetsData {
  dadosEmpresa: DadosEmpresa
  servicos: Servico[]
  profissionais: Profissional[]
  profissionalServicos: ProfissionalServico[]
  agendas: AgendaProfissional[]
}

type GoogleSheetName =
  | 'dados_empresa'
  | 'servicos'
  | 'profissional'
  | 'profissional_servicos'
  | 'profissional_agendas'

type SheetRow = Record<string, string>

const sheetRowsCache = new Map<GoogleSheetName, Promise<SheetRow[]>>()

function getSpreadsheetId() {
  const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID

  if (!spreadsheetId) {
    throw new Error('Planilha Google Sheets nao configurada.')
  }

  return spreadsheetId
}

function buildSheetCsvUrl(sheetName: GoogleSheetName) {
  const spreadsheetId = getSpreadsheetId()
  const searchParams = new URLSearchParams({
    sheet: sheetName,
    tqx: 'out:csv',
  })

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?${searchParams.toString()}`
}

function parseCsv(csv: string) {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentCell = ''
  let isInsideQuotes = false

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index]
    const nextCharacter = csv[index + 1]

    if (character === '"' && nextCharacter === '"') {
      currentCell += '"'
      index += 1
    } else if (character === '"') {
      isInsideQuotes = !isInsideQuotes
    } else if (character === ',' && !isInsideQuotes) {
      currentRow.push(currentCell)
      currentCell = ''
    } else if (character === '\n' && !isInsideQuotes) {
      currentRow.push(currentCell)
      rows.push(currentRow)
      currentRow = []
      currentCell = ''
    } else if (character !== '\r') {
      currentCell += character
    }
  }

  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell)
    rows.push(currentRow)
  }

  return rows
}

function parseSheetRows(csv: string): SheetRow[] {
  const [headerRow, ...dataRows] = parseCsv(csv)

  if (!headerRow) {
    return []
  }

  const headers = headerRow.map((header) => header.trim())

  return dataRows
    .filter((row) => row.some((cell) => cell.trim()))
    .map((row) =>
      headers.reduce<SheetRow>((sheetRow, header, index) => {
        sheetRow[header] = (row[index] ?? '').trim()
        return sheetRow
      }, {}),
    )
}

async function fetchSheetRows(sheetName: GoogleSheetName): Promise<SheetRow[]> {
  try {
    const response = await fetch(buildSheetCsvUrl(sheetName))

    if (!response.ok) {
      throw new Error('Falha ao carregar planilha.')
    }

    const csv = await response.text()

    return parseSheetRows(csv)
  } catch {
    throw new Error('Não foi possível carregar os dados da planilha.')
  }
}

function getSheetRows(sheetName: GoogleSheetName): Promise<SheetRow[]> {
  const cachedRows = sheetRowsCache.get(sheetName)

  if (cachedRows) {
    return cachedRows
  }

  const rowsPromise = fetchSheetRows(sheetName).catch((error: unknown) => {
    sheetRowsCache.delete(sheetName)
    throw error
  })

  sheetRowsCache.set(sheetName, rowsPromise)

  return rowsPromise
}

function parseBoolean(value: string) {
  return value.trim().toUpperCase() === 'TRUE'
}

function parseNumber(value: string) {
  return Number(value.replace(',', '.'))
}

function mapDadosEmpresa(row: SheetRow): DadosEmpresa {
  return {
    nome: row.nome,
    telefoneWhatsapp: row.telefone_whatsapp,
    endereco: row.endereco,
    instagram: row.instagram,
    logoUrl: row.logo_url,
    descricao: row.descricao || undefined,
    funcionamento: row.funcionamento || undefined,
  }
}

function mapServico(row: SheetRow): Servico {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    preco: parseNumber(row.preco),
    duracaoMinutos: parseNumber(row.duracao_minutos),
    ativo: parseBoolean(row.ativo),
  }
}

function mapProfissional(row: SheetRow): Profissional {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    fotoUrl: row.foto_url || undefined,
    ativo: parseBoolean(row.ativo),
  }
}

function mapProfissionalServico(row: SheetRow): ProfissionalServico {
  return {
    profissionalId: row.profissional_id,
    servicoId: row.servico_id,
  }
}

function mapAgenda(row: SheetRow): AgendaProfissional {
  return {
    profissionalId: row.profissional_id,
    googleCalendarId: row.google_calendar_id,
    horaInicio: row.hora_inicio,
    horaFim: row.hora_fim,
    intervaloMinutos: parseNumber(row.intervalo_minutos),
    ativo: parseBoolean(row.ativo),
  }
}

export async function getDadosEmpresa(): Promise<DadosEmpresa> {
  try {
    const [dadosEmpresaRow] = await getSheetRows('dados_empresa')

    if (!dadosEmpresaRow) {
      throw new Error('Dados da empresa não encontrados.')
    }

    return mapDadosEmpresa(dadosEmpresaRow)
  } catch {
    throw new Error('Não foi possível carregar as informações do estabelecimento.')
  }
}

export async function getServicos(): Promise<Servico[]> {
  try {
    const rows = await getSheetRows('servicos')

    return rows.map(mapServico).filter((servico) => servico.ativo)
  } catch {
    throw new Error('Não foi possível carregar os serviços disponíveis.')
  }
}

export async function getProfissionais(): Promise<Profissional[]> {
  try {
    const rows = await getSheetRows('profissional')

    return rows.map(mapProfissional).filter((profissional) => profissional.ativo)
  } catch {
    throw new Error('Não foi possível carregar os profissionais disponíveis.')
  }
}

export async function getProfissionalServicos(): Promise<ProfissionalServico[]> {
  try {
    const rows = await getSheetRows('profissional_servicos')

    return rows.map(mapProfissionalServico)
  } catch {
    throw new Error('Não foi possível carregar os vínculos de serviços.')
  }
}

export async function getAgendas(): Promise<AgendaProfissional[]> {
  try {
    const rows = await getSheetRows('profissional_agendas')

    return rows.map(mapAgenda).filter((agenda) => agenda.ativo)
  } catch {
    throw new Error('Não foi possível carregar as agendas dos profissionais.')
  }
}

export async function getGoogleSheetsData(): Promise<GoogleSheetsData> {
  try {
    const [dadosEmpresa, servicos, profissionais, profissionalServicos, agendas] =
      await Promise.all([
        getDadosEmpresa(),
        getServicos(),
        getProfissionais(),
        getProfissionalServicos(),
        getAgendas(),
      ])

    return {
      dadosEmpresa,
      servicos,
      profissionais,
      profissionalServicos,
      agendas,
    }
  } catch {
    throw new Error('Não foi possível carregar os dados da planilha.')
  }
}

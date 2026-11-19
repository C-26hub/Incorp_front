import type { LeadInput } from './api'

const MAX_IMPORT_ROWS = 100

const HEADER_ALIASES: Record<keyof LeadInput, string[]> = {
  name: ['name', 'nome', 'lead', 'contato'],
  company: ['company', 'empresa', 'organizacao', 'organization'],
  jobTitle: ['jobtitle', 'cargo', 'position', 'title'],
  email: ['email', 'e-mail'],
  phone: ['phone', 'telefone', 'celular', 'whatsapp'],
  website: ['website', 'site', 'url'],
  industry: ['industry', 'setor', 'segmento', 'industria'],
  companySize: ['companysize', 'porte', 'tamanhoempresa', 'numerodefuncionarios'],
  location: ['location', 'localizacao', 'cidade', 'regiao'],
  notes: ['notes', 'notas', 'observacao', 'observacoes'],
}

function normalizeHeader(value: string) {
  return value.trim().toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

function detectDelimiter(headerLine: string) {
  let commas = 0
  let semicolons = 0
  let quoted = false
  for (let index = 0; index < headerLine.length; index += 1) {
    if (headerLine[index] === '"' && headerLine[index + 1] === '"') {
      index += 1
    } else if (headerLine[index] === '"') {
      quoted = !quoted
    } else if (!quoted && headerLine[index] === ',') {
      commas += 1
    } else if (!quoted && headerLine[index] === ';') {
      semicolons += 1
    }
  }
  return semicolons > commas ? ';' : ','
}

function parseRows(text: string, delimiter: string) {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        field += character
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true
    } else if (character === delimiter) {
      row.push(field)
      field = ''
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && text[index + 1] === '\n') index += 1
      row.push(field)
      if (row.some((cell) => cell.trim())) rows.push(row)
      row = []
      field = ''
    } else {
      field += character
    }
  }

  if (quoted) throw new Error('O CSV contém um campo entre aspas que não foi fechado.')
  row.push(field)
  if (row.some((cell) => cell.trim())) rows.push(row)
  return rows
}

export function parseLeadCsv(text: string): LeadInput[] {
  const content = text.replace(/^\uFEFF/, '')
  const firstLine = content.split(/\r?\n/, 1)[0] ?? ''
  const [headers, ...rows] = parseRows(content, detectDelimiter(firstLine))
  if (!headers?.length || rows.length === 0) {
    throw new Error('O CSV precisa ter uma linha de cabeçalho e ao menos um lead.')
  }

  const normalizedHeaders = headers.map(normalizeHeader)
  const columns = Object.fromEntries(
    Object.entries(HEADER_ALIASES).map(([field, aliases]) => [
      field,
      normalizedHeaders.findIndex((header) => aliases.includes(header)),
    ]),
  ) as Record<keyof LeadInput, number>
  if (columns.name < 0) {
    throw new Error('Inclua uma coluna obrigatória "nome" ou "name" no CSV.')
  }
  if (rows.length > MAX_IMPORT_ROWS) {
    throw new Error(`O limite por importação é de ${MAX_IMPORT_ROWS} leads.`)
  }

  return rows.map((row, rowIndex) => {
    const lead = Object.fromEntries(
      Object.entries(columns)
        .filter(([, column]) => column >= 0)
        .map(([field, column]) => [field, row[column]?.trim() ?? '']),
    ) as LeadInput
    if (!lead.name) {
      throw new Error(`O lead da linha ${rowIndex + 2} não tem nome.`)
    }
    return lead
  })
}

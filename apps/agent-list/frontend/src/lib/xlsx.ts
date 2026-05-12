import * as XLSX from 'xlsx'
import type { ParsedTable } from './csv'

export async function parseXlsx(file: File): Promise<ParsedTable> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const firstSheet = workbook.SheetNames[0]
  if (!firstSheet) return { headers: [], rows: [] }
  const sheet = workbook.Sheets[firstSheet]
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' })
  if (aoa.length === 0) return { headers: [], rows: [] }
  const [headerRow, ...rest] = aoa
  return {
    headers: headerRow.map((h) => String(h ?? '').trim()),
    rows: rest.map((r) => r.map((cell) => String(cell ?? ''))),
  }
}

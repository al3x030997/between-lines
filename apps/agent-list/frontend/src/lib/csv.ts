import Papa from 'papaparse'

export interface ParsedTable {
  headers: string[]
  rows: string[][]
}

export function parseCsv(text: string): ParsedTable {
  const result = Papa.parse<string[]>(text, {
    skipEmptyLines: 'greedy',
  })
  if (result.errors.length) {
    const first = result.errors[0]
    throw new Error(`CSV parse error: ${first.message} (row ${first.row ?? '?'})`)
  }
  const data = result.data
  if (data.length === 0) {
    return { headers: [], rows: [] }
  }
  const [headers, ...rows] = data
  return {
    headers: headers.map((h) => String(h).trim()),
    rows: rows.map((r) => r.map((cell) => (cell ?? '').toString())),
  }
}

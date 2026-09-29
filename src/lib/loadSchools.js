// Server-only: import from getStaticProps, never from components.
import data from '@/data.json'
import { fetchSchools } from '@/functions'
import { normalizeSchool } from '@/lib/schools'
import { EXTRA_SCHOOLS } from '@/lib/extraSchools'

// Keep spreadsheet order: DO NOT SORT.
export async function loadSchools() {
  const local = () => (Array.isArray(data?.schools) ? data.schools : [])
  let rows = []
  try {
    const SHEET_ID = process.env.SPREADSHEET_ID
    rows = typeof SHEET_ID === 'string' && SHEET_ID.length > 0 ? await fetchSchools(SHEET_ID) : local()
  } catch (err) {
    // Never fail the build; fall back to local data
    rows = local()
  }
  const schools = (Array.isArray(rows) ? rows : [])
    .filter(Boolean)
    .map(normalizeSchool)
    .filter((s) => s.name)
  // Append website-only schools after the sheet's, unless the sheet already lists them
  const have = new Set(schools.map((s) => s.id))
  const extra = EXTRA_SCHOOLS.map(normalizeSchool).filter((s) => !have.has(s.id))
  return [...schools, ...extra]
}

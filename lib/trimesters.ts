/**
 * Institutional Trimester Registry
 * Single source of truth for the academy's four-trimester academic year.
 *
 * Spring  → January 1  – March 31
 * Summer  → April 1    – June 30
 * Autumn  → July 1     – September 30
 * Winter  → October 1  – December 31
 */

export type TrimesterSeason = 'Spring' | 'Summer' | 'Autumn' | 'Winter'

export interface Trimester {
  season: TrimesterSeason
  year: number
  label: string        // e.g. "Summer 2026"
  shortLabel: string   // e.g. "Summer '26"
  range: string        // e.g. "Apr 1 – Jun 30"
  start: Date
  end: Date
  filterKey: string    // e.g. "summer" — matches TimePeriod union in pages
}

/** Month ranges for each season (0-indexed months) */
const SEASON_MONTHS: Record<TrimesterSeason, { startMonth: number; endMonth: number }> = {
  Spring: { startMonth: 0, endMonth: 2 },   // Jan–Mar
  Summer: { startMonth: 3, endMonth: 5 },   // Apr–Jun
  Autumn: { startMonth: 6, endMonth: 8 },   // Jul–Sep
  Winter: { startMonth: 9, endMonth: 11 },  // Oct–Dec
}

const SEASON_ORDER: TrimesterSeason[] = ['Spring', 'Summer', 'Autumn', 'Winter']

const RANGE_LABELS: Record<TrimesterSeason, string> = {
  Spring: 'Jan 1 – Mar 31',
  Summer: 'Apr 1 – Jun 30',
  Autumn: 'Jul 1 – Sep 30',
  Winter: 'Oct 1 – Dec 31',
}

/**
 * Build a Trimester object for a given season and year.
 */
export function buildTrimester(season: TrimesterSeason, year: number): Trimester {
  const { startMonth, endMonth } = SEASON_MONTHS[season]
  const start = new Date(year, startMonth, 1, 0, 0, 0, 0)
  // Last day of endMonth
  const end = new Date(year, endMonth + 1, 0, 23, 59, 59, 999)

  return {
    season,
    year,
    label: `${season} ${year}`,
    shortLabel: `${season} '${String(year).slice(2)}`,
    range: RANGE_LABELS[season],
    start,
    end,
    filterKey: season.toLowerCase(),
  }
}

/**
 * Returns all four Trimester objects for a given year, in calendar order.
 */
export function getTrimesters(year: number): Trimester[] {
  return SEASON_ORDER.map((season) => buildTrimester(season, year))
}

/**
 * Returns the Trimester that contains the given date (defaults to today).
 */
export function getActiveTrimester(date?: Date): Trimester {
  const d = date ?? new Date()
  const month = d.getMonth() // 0-indexed
  const year = d.getFullYear()

  let season: TrimesterSeason
  if (month <= 2) season = 'Spring'
  else if (month <= 5) season = 'Summer'
  else if (month <= 8) season = 'Autumn'
  else season = 'Winter'

  return buildTrimester(season, year)
}

/**
 * Returns { start, end } Date objects for a given season and year.
 * Convenience wrapper for filter logic.
 */
export function getTrimesterDateRange(
  season: TrimesterSeason,
  year: number
): { start: Date; end: Date } {
  const { start, end } = buildTrimester(season, year)
  return { start, end }
}

/**
 * Given a filterKey (e.g. "summer") and a year, returns the date range.
 * Returns null if the key is not a valid trimester season.
 */
export function getDateRangeFromFilterKey(
  key: string,
  year: number
): { start: Date; end: Date } | null {
  const season = SEASON_ORDER.find((s) => s.toLowerCase() === key.toLowerCase())
  if (!season) return null
  return getTrimesterDateRange(season, year)
}

/**
 * Returns how many days remain in the given trimester from today.
 * Returns 0 if the trimester has already ended.
 */
export function getDaysRemaining(trimester: Trimester): number {
  const now = new Date()
  if (now > trimester.end) return 0
  const diff = trimester.end.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * A date is "within" a trimester if it falls between start and end (inclusive).
 */
export function isWithinTrimester(date: Date | string, trimester: Trimester): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  return d >= trimester.start && d <= trimester.end
}

export { SEASON_ORDER, RANGE_LABELS }

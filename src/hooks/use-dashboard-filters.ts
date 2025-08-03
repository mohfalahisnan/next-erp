"use client"

import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs'

// Define filter options
export const TIME_RANGES = {
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
  '1y': '1 year',
} as const

export const CHART_TYPES = {
  area: 'Area Chart',
  bar: 'Bar Chart',
  line: 'Line Chart',
} as const

type TimeRange = keyof typeof TIME_RANGES
type ChartType = keyof typeof CHART_TYPES

// Custom hook for dashboard filters using nuqs
export function useDashboardFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      timeRange: parseAsStringEnum<TimeRange>(Object.keys(TIME_RANGES) as TimeRange[]).withDefault('30d'),
      chartType: parseAsStringEnum<ChartType>(Object.keys(CHART_TYPES) as ChartType[]).withDefault('area'),
      search: parseAsString.withDefault(''),
      category: parseAsString.withDefault('all'),
    },
    {
      // Options for URL state management
      history: 'push', // Use push state for navigation
      shallow: false,  // Deep navigation
    }
  )

  return {
    ...filters,
    setFilters,
    // Helper functions
    setTimeRange: (timeRange: TimeRange) => setFilters({ timeRange }),
    setChartType: (chartType: ChartType) => setFilters({ chartType }),
    setSearch: (search: string) => setFilters({ search }),
    setCategory: (category: string) => setFilters({ category }),
    resetFilters: () => setFilters({
      timeRange: '30d',
      chartType: 'area',
      search: '',
      category: 'all',
    }),
  }
}
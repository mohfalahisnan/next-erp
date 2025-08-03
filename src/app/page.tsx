"use client"

import { StatsCards } from "@/components/stats-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { RecentActivity } from "@/components/recent-activity"
import { DataTable } from "@/components/data-table"
import { useDashboardFilters } from "@/hooks/use-dashboard-filters"
import { useDashboardStats, useChartData, useRecentActivity, useTableData, useRefreshDashboard } from "@/hooks/use-dashboard-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { IconRefresh, IconSearch } from "@tabler/icons-react"
import { TIME_RANGES, CHART_TYPES } from "@/hooks/use-dashboard-filters"
import { ThemeDemo } from "@/components/theme-demo"

export default function Home() {
  const {
    timeRange,
    chartType,
    search,
    category,
    setTimeRange,
    setChartType,
    setSearch,
    setCategory,
    resetFilters,
  } = useDashboardFilters()

  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: chartData, isLoading: chartLoading } = useChartData(timeRange)
  const { data: activity, isLoading: activityLoading } = useRecentActivity()
  const { data: tableData, isLoading: tableLoading } = useTableData(1, search)
  const refreshMutation = useRefreshDashboard()

  return (
    <>
      {/* Filter Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Dashboard Filters
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshMutation.mutate()}
                disabled={refreshMutation.isPending}
              >
                <IconRefresh className={`h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Use URL-based filters powered by nuqs and real-time data with React Query
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIME_RANGES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Chart Type</label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CHART_TYPES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="subscriptions">Subscriptions</SelectItem>
                  <SelectItem value="refunds">Refunds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Current Filter State */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">Time: {TIME_RANGES[timeRange]}</Badge>
            <Badge variant="secondary">Chart: {CHART_TYPES[chartType]}</Badge>
            {search && <Badge variant="secondary">Search: {search}</Badge>}
            {category !== 'all' && <Badge variant="secondary">Category: {category}</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards with Loading States */}
      {statsLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : statsError ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading stats: {statsError.message}</p>
          </CardContent>
        </Card>
      ) : (
        <StatsCards />
      )}

      {/* Chart and Activity */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mb-6">
        {chartLoading ? (
          <Card className="xl:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ) : (
          <ChartAreaInteractive className="xl:col-span-2" />
        )}
        
        {activityLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <RecentActivity />
        )}
      </div>

      {/* Data Table with Loading */}
      {tableLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <DataTable />
      )}

      {/* Theme Demo Section */}
      <ThemeDemo />

      {/* Debug Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Debug Info</CardTitle>
          <CardDescription>
            Current state managed by nuqs and React Query
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">URL State (nuqs)</h4>
              <pre className="text-xs bg-muted p-2 rounded">
                {JSON.stringify({ timeRange, chartType, search, category }, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Query Status (React Query)</h4>
              <pre className="text-xs bg-muted p-2 rounded">
                {JSON.stringify({
                  stats: { loading: statsLoading, error: !!statsError },
                  chart: { loading: chartLoading },
                  activity: { loading: activityLoading },
                  table: { loading: tableLoading },
                  refresh: { pending: refreshMutation.isPending }
                }, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

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
import { ThemeDemo } from "@/components/navigation/theme-demo"

export function DashboardContent() {
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

  const statsQuery = useDashboardStats()
  const chartQuery = useChartData(timeRange)
  const activityQuery = useRecentActivity()
  const tableQuery = useTableData(1, search)
  const refreshMutation = useRefreshDashboard()

  const handleRefresh = () => {
    refreshMutation.mutate()
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Filters</CardTitle>
          <CardDescription>
            Control the data displayed across all dashboard components
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
                  {Object.entries(TIME_RANGES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
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
                  {Object.entries(CHART_TYPES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input
                placeholder="Category filter..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleRefresh}
              disabled={refreshMutation.isPending}
              variant="outline"
              size="sm"
            >
              <IconRefresh className={`h-4 w-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button onClick={resetFilters} variant="outline" size="sm">
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {statsQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-8 w-[60px] mb-1" />
                <Skeleton className="h-3 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : statsQuery.isError ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Error loading stats: {statsQuery.error?.message}</p>
          </CardContent>
        </Card>
      ) : (
        <StatsCards />
      )}

      {/* Chart */}
      {chartQuery.isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      ) : chartQuery.isError ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Error loading chart: {chartQuery.error?.message}</p>
          </CardContent>
        </Card>
      ) : (
        <ChartAreaInteractive />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        {activityQuery.isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : activityQuery.isError ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-destructive">Error loading activity: {activityQuery.error?.message}</p>
            </CardContent>
          </Card>
        ) : (
          <RecentActivity />
        )}

        {/* Data Table */}
        {tableQuery.isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[100px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : tableQuery.isError ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-destructive">Error loading table: {tableQuery.error?.message}</p>
            </CardContent>
          </Card>
        ) : (
          <DataTable />
        )}
      </div>

      {/* Theme Demo Section */}
      <ThemeDemo />

      {/* Debug Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>URL State (nuqs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>Time Range: <Badge variant="outline">{timeRange}</Badge></div>
              <div>Chart Type: <Badge variant="outline">{chartType}</Badge></div>
              <div>Search: <Badge variant="outline">{search || "(empty)"}</Badge></div>
              <div>Category: <Badge variant="outline">{category || "(empty)"}</Badge></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Query Status (React Query)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>Stats: <Badge variant={statsQuery.isLoading ? "secondary" : statsQuery.isError ? "destructive" : "default"}>
                {statsQuery.isLoading ? "Loading" : statsQuery.isError ? "Error" : "Success"}
              </Badge></div>
              <div>Chart: <Badge variant={chartQuery.isLoading ? "secondary" : chartQuery.isError ? "destructive" : "default"}>
                {chartQuery.isLoading ? "Loading" : chartQuery.isError ? "Error" : "Success"}
              </Badge></div>
              <div>Activity: <Badge variant={activityQuery.isLoading ? "secondary" : activityQuery.isError ? "destructive" : "default"}>
                {activityQuery.isLoading ? "Loading" : activityQuery.isError ? "Error" : "Success"}
              </Badge></div>
              <div>Table: <Badge variant={tableQuery.isLoading ? "secondary" : tableQuery.isError ? "destructive" : "default"}>
                {tableQuery.isLoading ? "Loading" : tableQuery.isError ? "Error" : "Success"}
              </Badge></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
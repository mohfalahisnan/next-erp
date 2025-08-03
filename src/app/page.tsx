import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivity } from "@/components/recent-activity"

export default function Home() {
  return (
    <>
      <StatsCards />
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="rounded-xl md:col-span-2">
          <ChartAreaInteractive />
        </div>
        <div className="rounded-xl">
          <RecentActivity />
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <DataTable />
      </div>
    </>
  )
}

"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Mock API functions (replace with real API calls)
const fetchDashboardStats = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    totalRevenue: 45231.89,
    subscriptions: 2350,
    sales: 12234,
    activeUsers: 573,
    revenueChange: 20.1,
    subscriptionsChange: 180.1,
    salesChange: 19,
    usersChange: 201,
  }
}

const fetchChartData = async (timeRange: string) => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Generate mock data based on time range
  const dataPoints = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
  
  return Array.from({ length: dataPoints }, (_, i) => ({
    date: new Date(Date.now() - (dataPoints - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    desktop: Math.floor(Math.random() * 1000) + 500,
    mobile: Math.floor(Math.random() * 800) + 300,
  }))
}

const fetchRecentActivity = async () => {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  return [
    {
      id: '1',
      user: 'Olivia Martin',
      action: 'made a sale',
      amount: '+$1,999.00',
      time: '2 hours ago',
      avatar: '/avatars/01.png',
    },
    {
      id: '2',
      user: 'Jackson Lee',
      action: 'subscribed',
      amount: '+$39.00',
      time: '3 hours ago',
      avatar: '/avatars/02.png',
    },
    {
      id: '3',
      user: 'Isabella Nguyen',
      action: 'made a sale',
      amount: '+$299.00',
      time: '5 hours ago',
      avatar: '/avatars/03.png',
    },
  ]
}

const fetchTableData = async (page: number = 1, search: string = '') => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const allData = [
    { id: 'INV001', customer: 'John Doe', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
    { id: 'INV002', customer: 'Jane Smith', status: 'Pending', method: 'PayPal', amount: '$150.00' },
    { id: 'INV003', customer: 'Bob Johnson', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
    { id: 'INV004', customer: 'Alice Brown', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
    { id: 'INV005', customer: 'Charlie Wilson', status: 'Pending', method: 'PayPal', amount: '$200.00' },
  ]
  
  const filteredData = search 
    ? allData.filter(item => 
        item.customer.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase())
      )
    : allData
  
  return {
    data: filteredData,
    total: filteredData.length,
    page,
    pageSize: 10,
  }
}

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  chart: (timeRange: string) => [...dashboardKeys.all, 'chart', timeRange] as const,
  activity: () => [...dashboardKeys.all, 'activity'] as const,
  table: (page: number, search: string) => [...dashboardKeys.all, 'table', page, search] as const,
}

// Custom hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useChartData(timeRange: string) {
  return useQuery({
    queryKey: dashboardKeys.chart(timeRange),
    queryFn: () => fetchChartData(timeRange),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useRecentActivity() {
  return useQuery({
    queryKey: dashboardKeys.activity(),
    queryFn: fetchRecentActivity,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useTableData(page: number = 1, search: string = '') {
  return useQuery({
    queryKey: dashboardKeys.table(page, search),
    queryFn: () => fetchTableData(page, search),
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Mutation for refreshing data
export function useRefreshDashboard() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      // Simulate refresh action
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    },
    onSuccess: () => {
      // Invalidate all dashboard queries to refetch data
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
  })
}
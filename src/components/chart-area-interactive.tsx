'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const chartData = [
	{ month: 'January', desktop: 186, mobile: 80 },
	{ month: 'February', desktop: 305, mobile: 200 },
	{ month: 'March', desktop: 237, mobile: 120 },
	{ month: 'April', desktop: 73, mobile: 190 },
	{ month: 'May', desktop: 209, mobile: 130 },
	{ month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
	desktop: {
		label: 'Desktop',
		color: 'hsl(var(--chart-1))',
	},
	mobile: {
		label: 'Mobile',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

export function ChartAreaInteractive({ className }: { className?: string }) {
	const [timeRange, setTimeRange] = React.useState('90d');

	return (
		<Card className={cn(className)}>
			<CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
				<div className='grid flex-1 gap-1 text-center sm:text-left'>
					<CardTitle>Area Chart - Interactive</CardTitle>
					<CardDescription>
						Showing total visitors for the last 6 months
					</CardDescription>
				</div>
				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger
						className='w-[160px] rounded-lg sm:ml-auto'
						aria-label='Select a value'
					>
						<SelectValue placeholder='Last 3 months' />
					</SelectTrigger>
					<SelectContent className='rounded-xl'>
						<SelectItem value='90d' className='rounded-lg'>
							Last 3 months
						</SelectItem>
						<SelectItem value='30d' className='rounded-lg'>
							Last 30 days
						</SelectItem>
						<SelectItem value='7d' className='rounded-lg'>
							Last 7 days
						</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
				<ChartContainer
					config={chartConfig}
					className='aspect-auto h-[250px] w-full'
				>
					<AreaChart data={chartData}>
						<defs>
							<linearGradient
								id='fillDesktop'
								x1='0'
								y1='0'
								x2='0'
								y2='1'
							>
								<stop
									offset='5%'
									stopColor='var(--color-desktop)'
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor='var(--color-desktop)'
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient
								id='fillMobile'
								x1='0'
								y1='0'
								x2='0'
								y2='1'
							>
								<stop
									offset='5%'
									stopColor='var(--color-mobile)'
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor='var(--color-mobile)'
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='month'
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator='dot' />}
						/>
						<Area
							dataKey='mobile'
							type='natural'
							fill='url(#fillMobile)'
							fillOpacity={0.4}
							stroke='var(--color-mobile)'
							stackId='a'
						/>
						<Area
							dataKey='desktop'
							type='natural'
							fill='url(#fillDesktop)'
							fillOpacity={0.4}
							stroke='var(--color-desktop)'
							stackId='a'
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

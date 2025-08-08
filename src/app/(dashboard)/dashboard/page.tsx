import { Suspense } from 'react';
import { DashboardContent } from '@/components/dashboard-content';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

function DashboardSkeleton() {
	return (
		<div className='space-y-6'>
			{/* Filter Controls Skeleton */}
			<Card>
				<CardContent className='p-6'>
					<div className='space-y-4'>
						<Skeleton className='h-6 w-[200px]' />
						<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className='space-y-2'>
									<Skeleton className='h-4 w-[80px]' />
									<Skeleton className='h-10 w-full' />
								</div>
							))}
						</div>
						<div className='flex gap-2'>
							<Skeleton className='h-8 w-[120px]' />
							<Skeleton className='h-8 w-[100px]' />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Stats Cards Skeleton */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardContent className='p-6'>
							<Skeleton className='h-4 w-[100px] mb-2' />
							<Skeleton className='h-8 w-[60px] mb-1' />
							<Skeleton className='h-3 w-[80px]' />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Chart Skeleton */}
			<Card>
				<CardContent className='p-6'>
					<Skeleton className='h-[300px] w-full' />
				</CardContent>
			</Card>

			{/* Two Column Layout Skeleton */}
			<div className='grid gap-6 md:grid-cols-2'>
				{Array.from({ length: 2 }).map((_, i) => (
					<Card key={i}>
						<CardContent className='p-6'>
							<Skeleton className='h-[200px] w-full' />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<Suspense fallback={<DashboardSkeleton />}>
			<DashboardContent />
		</Suspense>
	);
}

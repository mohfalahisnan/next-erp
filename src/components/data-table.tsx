'use client';

import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
} from '@tabler/icons-react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const data = [
	{
		id: 'INV001',
		customer: 'John Doe',
		email: 'john@example.com',
		status: 'Paid',
		amount: '$250.00',
	},
	{
		id: 'INV002',
		customer: 'Jane Smith',
		email: 'jane@example.com',
		status: 'Pending',
		amount: '$150.00',
	},
	{
		id: 'INV003',
		customer: 'Bob Johnson',
		email: 'bob@example.com',
		status: 'Unpaid',
		amount: '$350.00',
	},
	{
		id: 'INV004',
		customer: 'Alice Brown',
		email: 'alice@example.com',
		status: 'Paid',
		amount: '$450.00',
	},
	{
		id: 'INV005',
		customer: 'Charlie Wilson',
		email: 'charlie@example.com',
		status: 'Pending',
		amount: '$550.00',
	},
];

function getStatusBadge(status: string) {
	switch (status) {
		case 'Paid':
			return <Badge variant='default'>Paid</Badge>;
		case 'Pending':
			return <Badge variant='secondary'>Pending</Badge>;
		case 'Unpaid':
			return <Badge variant='destructive'>Unpaid</Badge>;
		default:
			return <Badge variant='outline'>{status}</Badge>;
	}
}

export function DataTable() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Orders</CardTitle>
				<CardDescription>
					You have {data.length} orders in total.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Invoice</TableHead>
							<TableHead>Customer</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className='text-right'>Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((item) => (
							<TableRow key={item.id}>
								<TableCell className='font-medium'>
									{item.id}
								</TableCell>
								<TableCell>{item.customer}</TableCell>
								<TableCell>{item.email}</TableCell>
								<TableCell>
									{getStatusBadge(item.status)}
								</TableCell>
								<TableCell className='text-right'>
									{item.amount}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className='flex items-center justify-end space-x-2 py-4'>
					<Button variant='outline' size='sm' disabled>
						<IconChevronsLeft className='h-4 w-4' />
						First
					</Button>
					<Button variant='outline' size='sm' disabled>
						<IconChevronLeft className='h-4 w-4' />
						Previous
					</Button>
					<Button variant='outline' size='sm'>
						Next
						<IconChevronRight className='h-4 w-4' />
					</Button>
					<Button variant='outline' size='sm'>
						Last
						<IconChevronsRight className='h-4 w-4' />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

'use client';

import {
	IconUser,
	IconShoppingCart,
	IconCreditCard,
	IconFileText,
} from '@tabler/icons-react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const activities = [
	{
		id: 1,
		user: {
			name: 'Olivia Martin',
			email: 'olivia.martin@email.com',
			avatar: '/avatars/01.png',
		},
		action: 'made a purchase',
		amount: '+$1,999.00',
		time: '2 hours ago',
		icon: IconShoppingCart,
	},
	{
		id: 2,
		user: {
			name: 'Jackson Lee',
			email: 'jackson.lee@email.com',
			avatar: '/avatars/02.png',
		},
		action: 'subscribed to Pro',
		amount: '+$39.00',
		time: '3 hours ago',
		icon: IconCreditCard,
	},
	{
		id: 3,
		user: {
			name: 'Isabella Nguyen',
			email: 'isabella.nguyen@email.com',
			avatar: '/avatars/03.png',
		},
		action: 'created a report',
		amount: '',
		time: '4 hours ago',
		icon: IconFileText,
	},
	{
		id: 4,
		user: {
			name: 'William Kim',
			email: 'will@email.com',
			avatar: '/avatars/04.png',
		},
		action: 'updated profile',
		amount: '',
		time: '5 hours ago',
		icon: IconUser,
	},
	{
		id: 5,
		user: {
			name: 'Sofia Davis',
			email: 'sofia.davis@email.com',
			avatar: '/avatars/05.png',
		},
		action: 'made a purchase',
		amount: '+$299.00',
		time: '6 hours ago',
		icon: IconShoppingCart,
	},
];

export function RecentActivity() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Activity</CardTitle>
				<CardDescription>
					You have {activities.length} recent activities.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-8'>
					{activities.map((activity) => {
						const Icon = activity.icon;
						return (
							<div
								key={activity.id}
								className='flex items-center'
							>
								<Avatar className='h-9 w-9'>
									<AvatarImage
										src={activity.user.avatar}
										alt='Avatar'
									/>
									<AvatarFallback>
										{activity.user.name
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
								<div className='ml-4 space-y-1'>
									<p className='text-sm font-medium leading-none'>
										{activity.user.name}
									</p>
									<p className='text-sm text-muted-foreground'>
										{activity.action}
									</p>
									<p className='text-xs text-muted-foreground'>
										{activity.time}
									</p>
								</div>
								<div className='ml-auto flex items-center space-x-2'>
									{activity.amount && (
										<div className='font-medium'>
											{activity.amount}
										</div>
									)}
									<Icon className='h-4 w-4 text-muted-foreground' />
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}

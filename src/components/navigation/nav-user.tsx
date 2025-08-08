'use client';

import {
	IconBell,
	IconCreditCard,
	IconLogout,
	IconSettings,
	IconUser,
	IconMoon,
	IconSun,
	IconDeviceDesktop,
} from '@tabler/icons-react';
import { useTheme } from 'next-themes';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const { setTheme, theme } = useTheme();
	const { isMobile } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<Avatar className='h-8 w-8 rounded-lg'>
								<AvatarImage
									src={user.avatar}
									alt={user.name}
								/>
								<AvatarFallback className='rounded-lg'>
									{user.name
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-semibold'>
									{user.name}
								</span>
								<span className='truncate text-xs'>
									{user.email}
								</span>
							</div>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
						side={isMobile ? 'bottom' : 'right'}
						align='end'
						sideOffset={4}
					>
						<DropdownMenuLabel className='p-0 font-normal'>
							<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
								<Avatar className='h-8 w-8 rounded-lg'>
									<AvatarImage
										src={user.avatar}
										alt={user.name}
									/>
									<AvatarFallback className='rounded-lg'>
										{user.name
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>
										{user.name}
									</span>
									<span className='truncate text-xs'>
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<IconUser className='mr-2 h-4 w-4' />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconCreditCard className='mr-2 h-4 w-4' />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconBell className='mr-2 h-4 w-4' />
								Notifications
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconSettings className='mr-2 h-4 w-4' />
								Settings
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => setTheme('light')}
								className='flex items-center gap-2'
							>
								<IconSun className='h-4 w-4' />
								Light
								{theme === 'light' && (
									<span className='ml-auto text-xs'>✓</span>
								)}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setTheme('dark')}
								className='flex items-center gap-2'
							>
								<IconMoon className='h-4 w-4' />
								Dark
								{theme === 'dark' && (
									<span className='ml-auto text-xs'>✓</span>
								)}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setTheme('system')}
								className='flex items-center gap-2'
							>
								<IconDeviceDesktop className='h-4 w-4' />
								System
								{theme === 'system' && (
									<span className='ml-auto text-xs'>✓</span>
								)}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<IconLogout />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

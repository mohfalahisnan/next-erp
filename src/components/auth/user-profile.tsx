'use client';

import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserProfile() {
	const { data: session, isPending } = useSession();
	const router = useRouter();
	if (isPending) {
		return (
			<div className='flex items-center space-x-2'>
				<div className='h-8 w-8 rounded-full bg-muted animate-pulse' />
				<div className='h-4 w-20 bg-muted rounded animate-pulse' />
			</div>
		);
	}

	if (!session) {
		return null;
	}

	const handleSignOut = async () => {
		try {
			await signOut();
			router.push('/login');
		} catch (error) {
			console.error('Sign out error:', error);
		}
	};

	const initials =
		session.user.name
			?.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase() || 'U';

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='relative h-8 w-8 rounded-full'
				>
					<Avatar className='h-8 w-8'>
						<AvatarImage
							src={session.user.image || ''}
							alt={session.user.name || ''}
						/>
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56' align='end' forceMount>
				<DropdownMenuLabel className='font-normal'>
					<div className='flex flex-col space-y-1'>
						<p className='text-sm font-medium leading-none'>
							{session.user.name}
						</p>
						<p className='text-xs leading-none text-muted-foreground'>
							{session.user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<User className='mr-2 h-4 w-4' />
					<span>Profile</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut}>
					<LogOut className='mr-2 h-4 w-4' />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

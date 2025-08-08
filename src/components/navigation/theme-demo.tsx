'use client';

import { useTheme } from 'next-themes';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/navigation/theme-toggle';
import { IconMoon, IconSun, IconDeviceDesktop } from '@tabler/icons-react';

export function ThemeDemo() {
	const { theme, systemTheme, resolvedTheme } = useTheme();

	const getThemeIcon = (themeName: string) => {
		switch (themeName) {
			case 'light':
				return <IconSun className='h-4 w-4' />;
			case 'dark':
				return <IconMoon className='h-4 w-4' />;
			case 'system':
				return <IconDeviceDesktop className='h-4 w-4' />;
			default:
				return <IconDeviceDesktop className='h-4 w-4' />;
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					Theme System Demo
					<ThemeToggle />
				</CardTitle>
				<CardDescription>
					next-themes integration with system preference detection
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid gap-4 md:grid-cols-3'>
					<div className='space-y-2'>
						<h4 className='font-semibold flex items-center gap-2'>
							{getThemeIcon(theme || 'system')}
							Current Theme
						</h4>
						<Badge variant='outline' className='w-fit'>
							{theme || 'system'}
						</Badge>
					</div>

					<div className='space-y-2'>
						<h4 className='font-semibold flex items-center gap-2'>
							{getThemeIcon(systemTheme || 'light')}
							System Theme
						</h4>
						<Badge variant='outline' className='w-fit'>
							{systemTheme || 'light'}
						</Badge>
					</div>

					<div className='space-y-2'>
						<h4 className='font-semibold flex items-center gap-2'>
							{getThemeIcon(resolvedTheme || 'light')}
							Resolved Theme
						</h4>
						<Badge variant='outline' className='w-fit'>
							{resolvedTheme || 'light'}
						</Badge>
					</div>
				</div>

				<div className='mt-6 p-4 rounded-lg border bg-card'>
					<h4 className='font-semibold mb-2'>Theme Features:</h4>
					<ul className='text-sm text-muted-foreground space-y-1'>
						<li>• Automatic system theme detection</li>
						<li>• Smooth transitions between themes</li>
						<li>• Persistent theme preference</li>
						<li>• Available in header and user menu</li>
						<li>• CSS custom properties for theming</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}

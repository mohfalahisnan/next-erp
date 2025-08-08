'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ThemeToggle } from '@/components/navigation/theme-toggle';
import { UserProfile } from '@/components/auth/user-profile';

export function AppHeader() {
	const pathname = usePathname();

	// Generate breadcrumb items based on pathname
	const generateBreadcrumbs = () => {
		const segments = pathname.split('/').filter(Boolean);
		const breadcrumbs = [];

		// Always start with Dashboard
		breadcrumbs.push({
			label: 'Home',
			href: '/',
			isLast: segments.length === 0,
		});

		// Add segments as breadcrumbs
		let currentPath = '';
		segments.forEach((segment, index) => {
			currentPath += `/${segment}`;
			const isLast = index === segments.length - 1;

			breadcrumbs.push({
				label: segment.charAt(0).toUpperCase() + segment.slice(1),
				href: currentPath,
				isLast,
			});
		});

		return breadcrumbs;
	};

	const breadcrumbs = generateBreadcrumbs();

	return (
		<header className='flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
			<div className='flex items-center gap-2 px-4'>
				<SidebarTrigger className='-ml-1' />
				<Separator orientation='vertical' className='mr-2 h-4' />
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map((breadcrumb, index) => (
							<div
								key={breadcrumb.href}
								className='flex items-center'
							>
								{index > 0 && (
									<BreadcrumbSeparator className='hidden md:block' />
								)}
								<BreadcrumbItem
									className={
										index === 0 ? 'hidden md:block' : ''
									}
								>
									{breadcrumb.isLast ? (
										<BreadcrumbPage>
											{breadcrumb.label}
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink href={breadcrumb.href}>
											{breadcrumb.label}
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</div>
						))}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className='ml-auto flex items-center gap-2 px-4'>
				<UserProfile />
				<ThemeToggle />
			</div>
		</header>
	);
}

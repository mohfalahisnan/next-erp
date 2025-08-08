'use client';

import { ChevronRight } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { useState } from 'react';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

type NavItem = {
	title: string;
	url: string;
	icon?: LucideIcon | React.ComponentType<any>;
	isActive?: boolean;
	items?: NavItem[];
};

export function NavMain({ items }: { items: NavItem[] }) {
	const [openItems, setOpenItems] = useState<string[]>([]);

	const toggleItem = (title: string) => {
		setOpenItems((prev) =>
			prev.includes(title)
				? prev.filter((item) => item !== title)
				: [...prev, title]
		);
	};

	const renderNavItem = (item: NavItem) => {
		const hasSubItems = item.items && item.items.length > 0;
		const isOpen = openItems.includes(item.title);

		if (hasSubItems) {
			return (
				<Collapsible
					key={item.title}
					asChild
					open={isOpen}
					onOpenChange={() => toggleItem(item.title)}
				>
					<SidebarMenuItem>
						<CollapsibleTrigger asChild>
							<SidebarMenuButton tooltip={item.title}>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
								<ChevronRight
									className={`ml-auto transition-transform duration-200 ${
										isOpen ? 'rotate-90' : ''
									}`}
								/>
							</SidebarMenuButton>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<SidebarMenuSub>
								{item.items?.map((subItem) => {
									const hasSubSubItems =
										subItem.items &&
										subItem.items.length > 0;
									const isSubOpen = openItems.includes(
										subItem.title
									);

									if (hasSubSubItems) {
										return (
											<Collapsible
												key={subItem.title}
												asChild
												open={isSubOpen}
												onOpenChange={() =>
													toggleItem(subItem.title)
												}
											>
												<SidebarMenuSubItem>
													<CollapsibleTrigger asChild>
														<SidebarMenuSubButton>
															{subItem.icon && (
																<subItem.icon />
															)}
															<span>
																{subItem.title}
															</span>
															<ChevronRight
																className={`ml-auto transition-transform duration-200 ${
																	isSubOpen
																		? 'rotate-90'
																		: ''
																}`}
															/>
														</SidebarMenuSubButton>
													</CollapsibleTrigger>
													<CollapsibleContent>
														<SidebarMenuSub>
															{subItem.items?.map(
																(
																	subSubItem
																) => (
																	<SidebarMenuSubItem
																		key={
																			subSubItem.title
																		}
																	>
																		<SidebarMenuSubButton
																			asChild
																		>
																			<Link
																				href={
																					subSubItem.url
																				}
																			>
																				{subSubItem.icon && (
																					<subSubItem.icon />
																				)}
																				<span>
																					{
																						subSubItem.title
																					}
																				</span>
																			</Link>
																		</SidebarMenuSubButton>
																	</SidebarMenuSubItem>
																)
															)}
														</SidebarMenuSub>
													</CollapsibleContent>
												</SidebarMenuSubItem>
											</Collapsible>
										);
									}

									return (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton asChild>
												<Link href={subItem.url}>
													{subItem.icon && (
														<subItem.icon />
													)}
													<span>{subItem.title}</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									);
								})}
							</SidebarMenuSub>
						</CollapsibleContent>
					</SidebarMenuItem>
				</Collapsible>
			);
		}

		return (
			<SidebarMenuItem key={item.title}>
				<SidebarMenuButton tooltip={item.title} asChild>
					<Link href={item.url}>
						{item.icon && <item.icon />}
						<span>{item.title}</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		);
	};

	return (
		<SidebarGroup>
			<SidebarMenu>{items.map(renderNavItem)}</SidebarMenu>
		</SidebarGroup>
	);
}

import type { HeaderContext } from '@tanstack/react-table';
import {
	ArrowDown,
	ArrowUp,
	CalendarIcon,
	ChevronsUpDown,
	EyeOff,
	Filter,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { ColumnConfig } from './data-table';

export function DataTableHead({
	column,
	header,
	className,
	title,
}: HeaderContext<any, any> & { className?: string; title?: string }) {
	const columnDef = column.columnDef as ColumnConfig<any>;
	const filterType = columnDef.headerFilterType;
	const currentFilter = column.getFilterValue();

	if (!column.getCanSort()) {
		return <div>{header.id}</div>;
	}

	const [inputValue, setInputValue] = useState(
		(currentFilter as string) ?? ''
	);
	const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>(
		(currentFilter as { from?: Date; to?: Date }) ?? {}
	);
	const [singleDate, setSingleDate] = useState<Date | undefined>(
		currentFilter as Date | undefined
	);
	const [booleanValue, setBooleanValue] = useState<boolean | undefined>(
		currentFilter as boolean | undefined
	);
	const [selectValue, setSelectValue] = useState<string>(
		(currentFilter as string) ?? ''
	);
	const [multiSelectValues, setMultiSelectValues] = useState<string[]>(
		(currentFilter as string[]) ?? []
	);
	const [rangeValues, setRangeValues] = useState<{
		min?: number;
		max?: number;
	}>((currentFilter as { min?: number; max?: number }) ?? {});

	// Debounce effect for text/number inputs
	useEffect(() => {
		if (filterType === 'text' || filterType === 'number') {
			const timer = setTimeout(() => {
				column.setFilterValue(inputValue || undefined);
			}, 300); // 300ms debounce delay

			return () => clearTimeout(timer);
		}
	}, [inputValue, column, filterType]);

	// Effect for date filter
	useEffect(() => {
		if (filterType === 'date') {
			column.setFilterValue(singleDate || undefined);
		}
	}, [singleDate, column, filterType]);

	// Effect for date range filter
	useEffect(() => {
		if (filterType === 'dateRange') {
			if (dateRange.from || dateRange.to) {
				column.setFilterValue(dateRange);
			} else {
				column.setFilterValue(undefined);
			}
		}
	}, [dateRange, column, filterType]);

	// Effect for boolean filter
	useEffect(() => {
		if (filterType === 'boolean') {
			column.setFilterValue(booleanValue);
		}
	}, [booleanValue, column, filterType]);

	// Effect for select filter
	useEffect(() => {
		if (filterType === 'select' || filterType === 'enum') {
			column.setFilterValue(selectValue || undefined);
		}
	}, [selectValue, column, filterType]);

	// Effect for multi-select filter
	useEffect(() => {
		if (filterType === 'multiSelect') {
			column.setFilterValue(
				multiSelectValues.length > 0 ? multiSelectValues : undefined
			);
		}
	}, [multiSelectValues, column, filterType]);

	// Effect for range filter
	useEffect(() => {
		if (filterType === 'range') {
			if (
				rangeValues.min !== undefined ||
				rangeValues.max !== undefined
			) {
				column.setFilterValue(rangeValues);
			} else {
				column.setFilterValue(undefined);
			}
		}
	}, [rangeValues, column, filterType]);

	// Sync values when filter is cleared externally
	useEffect(() => {
		if (filterType === 'text' || filterType === 'number') {
			setInputValue((currentFilter as string) ?? '');
		} else if (filterType === 'date' || filterType === 'dateRange') {
			setDateRange((currentFilter as { from?: Date; to?: Date }) ?? {});
		} else if (filterType === 'boolean') {
			setBooleanValue(currentFilter as boolean | undefined);
		} else if (filterType === 'select' || filterType === 'enum') {
			setSelectValue((currentFilter as string) ?? '');
		} else if (filterType === 'multiSelect') {
			setMultiSelectValues((currentFilter as string[]) ?? []);
		} else if (filterType === 'range') {
			setRangeValues(
				(currentFilter as { min?: number; max?: number }) ?? {}
			);
		}
	}, [currentFilter, filterType]);

	const renderFilterContent = () => {
		if (!filterType) return null;

		switch (filterType) {
			case 'text':
			case 'number':
				return (
					<div className='p-2'>
						<Input
							placeholder={`Filter ${header.id}...`}
							value={inputValue}
							onChange={(e) => {
								e.stopPropagation();
								setInputValue(e.target.value);
							}}
							onClick={(e) => e.stopPropagation()}
							onFocus={(e) => e.stopPropagation()}
							type={filterType === 'number' ? 'number' : 'text'}
							className='h-8'
						/>
					</div>
				);

			case 'date':
				return (
					<div className='p-2 space-y-2'>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant='outline'
									size='sm'
									className='h-8 justify-start text-left font-normal'
									onClick={(e) => e.stopPropagation()}
								>
									<CalendarIcon className='mr-2 h-4 w-4' />
									{singleDate
										? singleDate.toLocaleDateString()
										: 'Pick a date'}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className='w-auto p-0'
								align='start'
							>
								<Calendar
									mode='single'
									selected={singleDate}
									onSelect={setSingleDate}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</div>
				);

			case 'dateRange':
				return (
					<div className='p-2 space-y-2'>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant='outline'
									size='sm'
									className='h-8 justify-start text-left font-normal'
									onClick={(e) => e.stopPropagation()}
								>
									<CalendarIcon className='mr-2 h-4 w-4' />
									{dateRange.from && dateRange.to
										? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
										: dateRange.from
											? `From ${dateRange.from.toLocaleDateString()}`
											: 'Pick date range'}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className='w-auto p-0'
								align='start'
							>
								<Calendar
									mode='range'
									selected={dateRange as any}
									onSelect={(range) =>
										setDateRange(range || {})
									}
									initialFocus
									numberOfMonths={2}
								/>
							</PopoverContent>
						</Popover>
					</div>
				);

			case 'boolean':
				return (
					<div className='p-2 space-y-2'>
						<div className='flex items-center space-x-2'>
							<Switch
								checked={booleanValue === true}
								onCheckedChange={(checked) => {
									setBooleanValue(checked ? true : undefined);
								}}
							/>
							<Label className='text-sm'>
								{booleanValue === true ? 'True' : 'All'}
							</Label>
						</div>
						<Button
							variant='outline'
							size='sm'
							onClick={() => setBooleanValue(false)}
							className={cn(
								'h-6 text-xs',
								booleanValue === false &&
									'bg-primary text-primary-foreground'
							)}
						>
							False only
						</Button>
					</div>
				);

			case 'select':
			case 'enum':
				return (
					<div className='p-2 space-y-2'>
						<Select
							value={selectValue}
							onValueChange={(value) => setSelectValue(value)}
						>
							<SelectTrigger className='h-8'>
								<SelectValue placeholder='Select option...' />
							</SelectTrigger>
							<SelectContent>
								{/* Options should be passed from column configuration */}
								{columnDef.filterOptions?.map((option) => (
									<SelectItem
										key={option.value}
										value={String(option.value)}
									>
										{option.label}
									</SelectItem>
								)) || (
									<SelectItem value='placeholder' disabled>
										No options configured
									</SelectItem>
								)}
							</SelectContent>
						</Select>
					</div>
				);

			case 'multiSelect':
				return (
					<div className='p-2 space-y-2'>
						<div className='space-y-1 max-h-32 overflow-y-auto'>
							{columnDef.filterOptions?.map((option) => (
								<div
									key={option.value}
									className='flex items-center space-x-2'
								>
									<Checkbox
										id={`filter-${option.value}`}
										checked={multiSelectValues.includes(
											String(option.value)
										)}
										onCheckedChange={(checked) => {
											if (checked) {
												setMultiSelectValues([
													...multiSelectValues,
													String(option.value),
												]);
											} else {
												setMultiSelectValues(
													multiSelectValues.filter(
														(v) =>
															v !==
															String(option.value)
													)
												);
											}
										}}
									/>
									<Label
										htmlFor={`filter-${option.value}`}
										className='text-sm font-normal cursor-pointer'
									>
										{option.label}
									</Label>
								</div>
							)) || (
								<div className='text-sm text-muted-foreground'>
									No options configured
								</div>
							)}
						</div>
					</div>
				);

			case 'range': {
				const progressValue =
					rangeValues.min && rangeValues.max
						? (rangeValues.min + rangeValues.max) / 2
						: rangeValues.min || rangeValues.max || 0;
				return (
					<div className='p-2 space-y-3'>
						{(rangeValues.min !== undefined ||
							rangeValues.max !== undefined) && (
							<div className='space-y-2'>
								<div className='flex items-center justify-between text-xs text-muted-foreground'>
									<span>{rangeValues.min ?? 'Min'}</span>
									<span>{rangeValues.max ?? 'Max'}</span>
								</div>
								<Progress
									value={Math.min(progressValue, 100)}
									className='h-2'
								/>
							</div>
						)}
						<div className='grid grid-cols-2 gap-2'>
							<div className='space-y-1'>
								<Label className='text-xs text-muted-foreground'>
									Min
								</Label>
								<Input
									type='number'
									placeholder='0'
									value={rangeValues.min ?? ''}
									onChange={(e) => {
										e.stopPropagation();
										setRangeValues({
											...rangeValues,
											min: e.target.value
												? Number(e.target.value)
												: undefined,
										});
									}}
									onClick={(e) => e.stopPropagation()}
									className='h-8'
								/>
							</div>
							<div className='space-y-1'>
								<Label className='text-xs text-muted-foreground'>
									Max
								</Label>
								<Input
									type='number'
									placeholder='100'
									value={rangeValues.max ?? ''}
									onChange={(e) => {
										e.stopPropagation();
										setRangeValues({
											...rangeValues,
											max: e.target.value
												? Number(e.target.value)
												: undefined,
										});
									}}
									onClick={(e) => e.stopPropagation()}
									className='h-8'
								/>
							</div>
						</div>
					</div>
				);
			}

			default:
				return null;
		}
	};

	return (
		<div className={cn('flex items-center gap-2', className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						size='sm'
						className='data-[state=open]:bg-accent -ml-3 h-8'
					>
						<span className='capitalize'>{title || header.id}</span>
						{column.getIsSorted() === 'desc' ? (
							<ArrowDown />
						) : column.getIsSorted() === 'asc' ? (
							<ArrowUp />
						) : (
							<ChevronsUpDown />
						)}
						{(currentFilter as boolean) && (
							<Filter className='ml-1 h-3 w-3 text-blue-600' />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start' className='w-56'>
					<DropdownMenuItem
						onClick={() =>
							column.getIsSorted() === 'asc'
								? column.clearSorting()
								: column.toggleSorting(false)
						}
					>
						<ArrowUp />
						<span className='opacity-0 w-0'>- </span>Asc
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							column.getIsSorted() === 'desc'
								? column.clearSorting()
								: column.toggleSorting(true)
						}
					>
						<ArrowDown />
						<span className='opacity-0 w-0'>- </span>Desc
					</DropdownMenuItem>

					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => column.toggleVisibility(false)}
					>
						<EyeOff className='mr-1.5' />
						Hide
					</DropdownMenuItem>
					{renderFilterContent()}
					{filterType && (currentFilter as any) && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => column.setFilterValue(undefined)}
								variant='destructive'
							>
								<X className='h-4 w-4' />
								Clear Filter
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export function HeaderSelect({ table }: HeaderContext<any, any>) {
	return (
		<Checkbox
			checked={
				table.getIsAllPageRowsSelected() ||
				(table.getIsSomePageRowsSelected() && 'indeterminate')
			}
			onCheckedChange={(value) =>
				table.toggleAllPageRowsSelected(!!value)
			}
			aria-label='Select all'
		/>
	);
}

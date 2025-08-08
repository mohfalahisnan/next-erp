import type { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';

interface DataTableSearchProps {
	table: Table<any>;
	placeholder?: string;
	className?: string;
}

function DataTableSearch({
	table,
	placeholder = 'Search...',
	className = 'max-w-[160px]',
}: DataTableSearchProps) {
	const globalFilter = table.getState().globalFilter as string;

	return (
		<div className='flex gap-2 items-center'>
			<Input
				placeholder={placeholder}
				value={globalFilter ?? ''}
				onChange={(event) => table.setGlobalFilter(event.target.value)}
				className={className}
			/>
		</div>
	);
}

export default DataTableSearch;

import type { Table } from '@tanstack/react-table';

import SelectFilter from './data-table-select-filter';

export interface FilterOptions {
	accessorKey: string;
	label: string;
	values: {
		label: string;
		value: string;
	}[];
	multiple?: boolean;
}

interface DataTableFiltersProps {
	table: Table<any>;
	filterOptions: FilterOptions[];
}

function DataTableFilters({ table, filterOptions }: DataTableFiltersProps) {
	// TODO: add multiple select support
	const handleSelectChange = (value: string, accessorKey: string) => {
		const column = table.getColumn(accessorKey);
		const currentValue = column?.getFilterValue() as string | undefined;

		if (currentValue === value) {
			// If clicking the same value, clear the filter
			column?.setFilterValue(undefined);
		} else {
			// Set new filter value
			column?.setFilterValue(value);
		}
	};

	if (filterOptions.length === 0) {
		return null;
	}

	return (
		<>
			{filterOptions.map((filter) => (
				<SelectFilter
					key={filter.accessorKey}
					filter={filter}
					value={
						table
							.getColumn(filter.accessorKey)
							?.getFilterValue() as string
					}
					onChange={(value) =>
						handleSelectChange(value, filter.accessorKey)
					}
					clearFilter={
						table
							.getColumn(filter.accessorKey)
							?.getFilterValue() !== undefined
					}
				/>
			))}
		</>
	);
}

export default DataTableFilters;

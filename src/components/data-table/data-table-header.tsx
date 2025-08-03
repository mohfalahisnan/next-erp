import type { Table } from "@tanstack/react-table";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DataTableDateFilter from "./data-table-date-filter";
import DataTableFilters, { type FilterOptions } from "./data-table-filters";
import DataTableSearch from "./data-table-search";
import { useDataTable } from "./data-table-context";
import DataTableBulkActions from "./data-table-bulk-actions";
import { config } from "@/app/dashboard/config";
import DataTableColumnSelector from "./data-table-column-selector";

export interface DataTableHeaderProps {
	table: Table<any>;
	className?: string;
	search?: boolean;
	filterOptions?: FilterOptions[];
	filterDate?: boolean;
	dateColumnId?: string;
	dateLabel?: string;
	searchPlaceholder?: string;
	showCreateButton?: boolean;
	createButtonLabel?: string;
}

function DataTableHeader({
	table,
	className,
	search = true,
	filterDate = true,
	filterOptions = [],
	dateColumnId = "createdAt",
	dateLabel = "CreatedAt",
	searchPlaceholder = "Search...",
	showCreateButton = true,
	createButtonLabel = "Create New",
}: DataTableHeaderProps) {
	const { openCreateForm } = useDataTable();
	const globalFilter = table.getState().globalFilter as string;
	const dateRangeFilter = table.getColumn(dateColumnId)?.getFilterValue();

	const hasActiveFilters =
		globalFilter ||
		dateRangeFilter ||
		filterOptions.some((filter) =>
			table.getColumn(filter.accessorKey)?.getFilterValue(),
		);

	const clearAllFilters = () => {
		if (globalFilter) table.setGlobalFilter("");
		if (dateRangeFilter)
			table.getColumn(dateColumnId)?.setFilterValue(undefined);
		filterOptions.forEach((filter) => {
			if (table.getColumn(filter.accessorKey)?.getFilterValue()) {
				table.getColumn(filter.accessorKey)?.setFilterValue(undefined);
			}
		});
	};

	return (
		<div>
			<div className={cn("flex items-center py-4 gap-2", className)}>
				<div className="flex gap-2 flex-1">
					{search && (
						<DataTableSearch table={table} placeholder={searchPlaceholder} />
					)}
					<DataTableFilters table={table} filterOptions={filterOptions} />
					{filterDate && (
						<DataTableDateFilter
							table={table}
							columnId={dateColumnId}
							label={dateLabel}
						/>
					)}
					{hasActiveFilters && (
						<Button variant="dashed" onClick={clearAllFilters} className="px-2">
							<X className="h-4 w-4" />
							Clear All
						</Button>
					)}
				</div>
				{showCreateButton && (
					<Button onClick={openCreateForm} className="ml-2">
						<Plus className="h-4 w-4 mr-2" />
						{createButtonLabel}
					</Button>
				)}
			<DataTableColumnSelector table={table} />
			</div>
				

							<DataTableBulkActions
					table={table}
					bulkActions={config.bulkActions}
				/>
		</div>
	);
}

export default DataTableHeader;

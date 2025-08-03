import type { Table } from "@tanstack/react-table";
import { Calendar1Icon, ChevronDownIcon } from "lucide-react";
import React from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface DataTableDateFilterProps {
	table: Table<any>;
	columnId?: string;
	label?: string;
}

function DataTableDateFilter({
	table,
	columnId = "createdAt",
}: DataTableDateFilterProps) {
	const [open, setOpen] = React.useState(false);

	// Get date range from table filters
	const dateRangeFilter = table.getColumn(columnId)?.getFilterValue() as
		| DateRange
		| undefined;

	const handleDateRangeSelect = (range: DateRange | undefined) => {
		if (!range) {
			table.getColumn(columnId)?.setFilterValue(undefined);
		} else if (range.from && range.to) {
			table.getColumn(columnId)?.setFilterValue(range);
			setOpen(false);
		} else if (range.from && !range.to) {
			table
				.getColumn(columnId)
				?.setFilterValue({ from: range.from, to: undefined });
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="dashed"
					id="dateRange"
					className="justify-between font-normal"
				>
					<Calendar1Icon className="h-4 w-4" />
					{columnId}
					{dateRangeFilter?.from && (
						<span className="ml-2">
							{dateRangeFilter.from.toLocaleDateString()}
							{dateRangeFilter.to && (
								<>
									{" - "}
									{dateRangeFilter.to.toLocaleDateString()}
								</>
							)}
						</span>
					)}
					<ChevronDownIcon className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto overflow-hidden p-0" align="start">
				<Calendar
					mode="range"
					selected={dateRangeFilter}
					captionLayout="dropdown"
					onSelect={handleDateRangeSelect}
					numberOfMonths={2}
				/>
				{dateRangeFilter && (
					<div className="p-2">
						<Button
							onClick={() => {
								handleDateRangeSelect(undefined);
								setOpen(false);
							}}
							variant="secondary"
							className="w-full"
						>
							Clear
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}

export default DataTableDateFilter;

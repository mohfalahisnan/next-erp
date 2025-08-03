import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BulkAction } from "./data-table";

interface DataTableBulkActionsProps<T> {
	table: Table<T>;
	bulkActions?: BulkAction<T>[];
	className?: string;
}

export function DataTableBulkActions<T>({
	table,
	bulkActions = [],
	className,
}: DataTableBulkActionsProps<T>) {
	const selectedRows = table.getSelectedRowModel().rows;
	const selectedData = selectedRows.map((row) => row.original);
	const selectedCount = selectedRows.length;

	if (bulkActions.length === 0) {
		return null;
	}

	const clearSelection = () => {
		table.toggleAllRowsSelected(false);
	};

	return (
		<div
			className={cn(
				"flex items-center justify-between p-4 bg-muted/50 border rounded-lg mb-4",
				className,
			)}
		>
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium">
					{selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
				</span>
				{selectedCount > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearSelection}
						className="h-6 px-2"
					>
						<X className="h-3 w-3" />
						Clear
					</Button>
				)}
			</div>

			<div className="flex items-center gap-2">
				{bulkActions.map((action, index) => {
					const isVisible = action.visible
						? action.visible(selectedData)
						: true;
					const isDisabled = action.disabled
						? action.disabled(selectedData)
						: false;
					const requiresSelection = action.requireSelection !== false;

					if (!isVisible) {
						return null;
					}

					return (
						<Button
							key={index}
							variant={action.variant || "default"}
							size="sm"
							disabled={isDisabled || (requiresSelection && selectedCount === 0)}
							onClick={() => action.action(selectedData)}
							className="flex items-center gap-2"
						>
							{action.icon}
							{action.label}
						</Button>
					);
				})}
			</div>
		</div>
	);
}

export default DataTableBulkActions;

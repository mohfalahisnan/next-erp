import { TableConfig } from "@/components/data-table/data-table";
import { Transfer } from "@/lib/db";
import { IconDownload } from "@tabler/icons-react";

export const config: TableConfig<Transfer> = {
	api: {
		params: {
			populate: "fromWarehouse,toWarehouse,requestedBy",
			depth: 2,
			limit: 10,
		},
		model: "transfers",
	},
	columns: [		{
			accessorKey: "fromWarehouse.name",
			headerLabel: "FromWarehouse",
		},		{
			accessorKey: "toWarehouse.name",
			headerLabel: "ToWarehouse",
		},		{
			accessorKey: "status",
			headerFilterType: "text",
		},		{
			accessorKey: "requestedBy.name",
			headerLabel: "RequestedBy",
		},		{
			accessorKey: "createdAt",
			cellType: "date",
			headerFilterType: "dateRange",
		},	],
	headerProps: {
		dateColumnId: "createdAt",
		filterDate: true,
		showCreateButton: true,
	},
	withActions: true,
	withSelect: true,
	customActions: [
		{
			label: "Export Data",
			icon: <IconDownload className="h-4 w-4" />,
			action: (row: Transfer) => {
				console.log("Exporting:", row);
			},
			variant: "outline" as const,
		},
	],
	bulkActions: [
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: Transfer[]) => {
				console.log("Exporting:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
};

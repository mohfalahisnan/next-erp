import { TableConfig } from "@/components/data-table/data-table";
import { TransferItem } from "@/lib/db";
import { IconDownload } from "@tabler/icons-react";

export const config: TableConfig<TransferItem> = {
	api: {
		params: {
			populate: "transfer,productVariant",
			depth: 2,
			limit: 10,
		},
		model: "transferItems",
	},
	columns: [		{
			accessorKey: "transfer.id",
			headerFilterType: "text",
		},		{
			accessorKey: "productVariant.name",
			headerLabel: "ProductVariant",
		},		{
			accessorKey: "quantity",
			headerFilterType: "text",
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
			action: (row: TransferItem) => {
				console.log("Exporting:", row);
			},
			variant: "outline" as const,
		},
	],
	bulkActions: [
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: TransferItem[]) => {
				console.log("Exporting:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
};

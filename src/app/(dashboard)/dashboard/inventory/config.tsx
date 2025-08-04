import { TableConfig } from ""@/components/data-table/data-table"";
import { Inventory } from ""@/lib/db"";
import { IconArchive, IconDownload, IconPrinter } from ""@tabler/icons-react"";

export const config: TableConfig<Inventory> = {
	api: {
		params: {
			populate: ""productVariant,warehouse"",
			depth: 2,
			limit: 10,
		},
		model: ""inventory"",
	},
	columns: [		{
			accessorKey: ""productVariant.name"",
			headerLabel: ""ProductVariant"",
		},		{
			accessorKey: ""warehouse.name"",
			headerLabel: ""Warehouse"",
		},		{
			accessorKey: ""quantity"",
			headerFilterType: ""text"",
		},		{
			accessorKey: ""reservedQuantity"",
			headerFilterType: ""text"",
		},		{
			accessorKey: ""createdAt"",
			cellType: ""date"",
			headerFilterType: ""dateRange"",
		},	],
	headerProps: {
		dateColumnId: ""createdAt"",
		filterDate: true,
		showCreateButton: true,
	},
	withActions: true,
	withSelect: true,
	customActions: [
		{
			label: ""Export Data"",
			icon: <IconDownload className=""h-4 w-4"" />,
			action: (row: Inventory) => {
				console.log(""Exporting:"", row);
			},
			variant: ""outline"" as const,
		},
	],
	bulkActions: [
		{
			label: ""Export Selected"",
			icon: <IconDownload className=""h-4 w-4"" />,
			action: (selectedRows: Inventory[]) => {
				console.log(""Exporting:"", selectedRows);
			},
			requireSelection: true,
			variant: ""outline"" as const,
		},
	],
};

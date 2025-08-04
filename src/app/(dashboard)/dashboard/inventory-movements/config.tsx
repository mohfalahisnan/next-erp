import { TableConfig } from ""@/components/data-table/data-table"";
import { InventoryMovement } from ""@/lib/db"";
import { IconArchive, IconDownload, IconPrinter } from ""@tabler/icons-react"";

export const config: TableConfig<InventoryMovement> = {
	api: {
		params: {
			populate: ""inventory,user"",
			depth: 2,
			limit: 10,
		},
		model: ""inventoryMovements"",
	},
	columns: [		{
			accessorKey: ""inventory.productVariant.name"",
			headerLabel: ""ProductVariant"",
		},		{
			accessorKey: ""movementType"",
			headerFilterType: ""text"",
		},		{
			accessorKey: ""quantity"",
			headerFilterType: ""text"",
		},		{
			accessorKey: ""user.name"",
			headerLabel: ""User"",
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
			action: (row: InventoryMovement) => {
				console.log(""Exporting:"", row);
			},
			variant: ""outline"" as const,
		},
	],
	bulkActions: [
		{
			label: ""Export Selected"",
			icon: <IconDownload className=""h-4 w-4"" />,
			action: (selectedRows: InventoryMovement[]) => {
				console.log(""Exporting:"", selectedRows);
			},
			requireSelection: true,
			variant: ""outline"" as const,
		},
	],
};

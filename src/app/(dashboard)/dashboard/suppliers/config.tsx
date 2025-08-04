import { TableConfig } from "@/components/data-table/data-table";
import { Supplier } from "@/lib/db";
import { IconDownload } from "@tabler/icons-react";

export const config: TableConfig<Supplier> = {
	api: {
		params: {
			populate: "products",
			depth: 2,
			limit: 10,
		},
		model: "suppliers",
	},
	columns: [		{
			accessorKey: "name",
			headerFilterType: "text",
		},		{
			accessorKey: "contactPerson",
			headerFilterType: "text",
		},		{
			accessorKey: "email",
			headerFilterType: "text",
		},		{
			accessorKey: "phone",
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
			action: (row: Supplier) => {
				console.log("Exporting:", row);
			},
			variant: "outline" as const,
		},
	],
	bulkActions: [
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: Supplier[]) => {
				console.log("Exporting:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
};

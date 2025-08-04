import { TableConfig } from "@/components/data-table/data-table";
import { Carrier } from "@/lib/db";
import { IconArchive, IconDownload, IconPrinter } from "@tabler/icons-react";

export const config: TableConfig<Carrier> = {
	api: {
		params: {
			populate: "shipments",
			depth: 2,
			limit: 10,
		},
		model: "carriers",
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
			action: (row: Carrier) => {
				console.log("Exporting:", row);
			},
			variant: "outline" as const,
		},
	],
	bulkActions: [
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: Carrier[]) => {
				console.log("Exporting:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
};

import { TableConfig } from "@/components/data-table/data-table";
import { Customer } from "@/lib/db";
import { IconArchive, IconDownload, IconPrinter } from "@tabler/icons-react";

export const config: TableConfig<Customer> = {
	api: {
		params: {
			populate: "addresses,orders",
			depth: 2,
			limit: 10,
		},
		model: "customers",
	},
	columns: [		{
			accessorKey: "name",
			headerFilterType: "text",
		},		{
			accessorKey: "email",
			headerFilterType: "text",
		},		{
			accessorKey: "phone",
			headerFilterType: "text",
		},		{
			accessorKey: "customerType",
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
			action: (row: Customer) => {
				console.log("Exporting:", row);
			},
			variant: "outline" as const,
		},
	],
	bulkActions: [
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: Customer[]) => {
				console.log("Exporting selected:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
};

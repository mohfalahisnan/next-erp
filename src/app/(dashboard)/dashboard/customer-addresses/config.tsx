import { TableConfig } from "@/components/data-table/data-table";
import { CustomerAddress } from "@/lib/db";
import { IconDownload } from "@tabler/icons-react";

export const config: TableConfig<CustomerAddress> = {
	api: {
		params: {
			populate: "customer",
			depth: 2,
			limit: 10,
		},
		model: "customerAddresses",
	},
	columns: [		{
			accessorKey: "customer.name",
			headerLabel: "Customer",
		},		{
			accessorKey: "addressType",
			headerFilterType: "text",
		},		{
			accessorKey: "street",
			headerFilterType: "text",
		},		{
			accessorKey: "city",
			headerFilterType: "text",
		},		{
			accessorKey: "country",
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
			action: (row: CustomerAddress) => {
				console.log("Exporting:", row);
			},
			variant: "outline" as const,
		},
	],
	bulkActions: [
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: CustomerAddress[]) => {
				console.log("Exporting:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
};

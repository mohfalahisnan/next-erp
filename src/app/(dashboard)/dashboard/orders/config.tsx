import { TableConfig } from "@/components/data-table/data-table";
import { Order } from "@/lib/db";
import { IconDownload } from "@tabler/icons-react";

export const config: TableConfig<Order> = {
	api: {
		params: {
			populate: "customer,warehouse,items",
			depth: 2,
			limit: 10,
		},
		model: "orders",
	},
	columns: [		{
			accessorKey: "orderNumber",
			headerFilterType: "text",
		},		{
			accessorKey: "customer.name",
			headerLabel: "Customer",
		},		{
			accessorKey: "warehouse.name",
			headerLabel: "Warehouse",
		},		{
			accessorKey: "status",
			headerFilterType: "text",
		},		{
			accessorKey: "totalAmount",
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
			action: (row: Order) => {
				console.log("Exporting:", row);
			},
			variant: "outline" as const,
		},
	],
	bulkActions: [
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: Order[]) => {
				console.log("Exporting:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
};

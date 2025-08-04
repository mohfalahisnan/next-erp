import { TableConfig } from "@/components/data-table/data-table";
import { OrderItem } from "@/lib/db";
import { IconArchive, IconDownload, IconPrinter } from "@tabler/icons-react";

export const config: TableConfig<OrderItem> = {
	api: {
		params: {
			populate: "order,productVariant",
			depth: 2,
			limit: 10,
		},
		model: "orderItems",
	},
	columns: [		{
			accessorKey: "order.orderNumber",
			headerFilterType: "text",
		},		{
			accessorKey: "productVariant.name",
			headerLabel: "ProductVariant",
		},		{
			accessorKey: "quantity",
			headerFilterType: "text",
		},		{
			accessorKey: "unitPrice",
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
			action: (row: OrderItem) => {
				console.log("Exporting:", row);
			},
			variant: "outline" as const,
		},
	],
	bulkActions: [
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: OrderItem[]) => {
				console.log("Exporting:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
};

import { TableConfig } from "@/components/data-table/data-table";
import { Shipment } from "@/lib/db";
import { IconDownload } from "@tabler/icons-react";

export const config: TableConfig<Shipment> = {
	api: {
		params: {
			populate: "order,carrier,warehouse",
			depth: 2,
			limit: 10,
		},
		model: "shipments",
	},
	columns: [		{
			accessorKey: "trackingNumber",
			headerFilterType: "text",
		},		{
			accessorKey: "order.orderNumber",
			headerFilterType: "text",
		},		{
			accessorKey: "carrier.name",
			headerLabel: "Carrier",
		},		{
			accessorKey: "status",
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
			action: (row: Shipment) => {
				console.log("Exporting:", row);
			},
			variant: "outline" as const,
		},
	],
	bulkActions: [
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: Shipment[]) => {
				console.log("Exporting:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
};

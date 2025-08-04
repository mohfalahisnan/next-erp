import { TableConfig } from "@/components/data-table/data-table";
import { ProductVariant } from "@/lib/db";
import { IconDownload } from "@tabler/icons-react";

export const config: TableConfig<ProductVariant> = {
	api: {
		params: {
			populate: "product,inventory",
			depth: 2,
			limit: 10,
		},
		model: "productVariants",
	},
	columns: [		{
			accessorKey: "name",
			headerFilterType: "text",
		},		{
			accessorKey: "product.name",
			headerLabel: "Product",
		},		{
			accessorKey: "sku",
			headerFilterType: "text",
		},		{
			accessorKey: "price",
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
			action: (row: ProductVariant) => {
				console.log("Exporting:", row);
			},
			variant: "outline" as const,
		},
	],
	bulkActions: [
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: ProductVariant[]) => {
				console.log("Exporting:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
};

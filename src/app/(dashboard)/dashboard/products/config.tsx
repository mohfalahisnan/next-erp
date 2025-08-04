import { TableConfig } from "@/components/data-table/data-table";
import { Product } from "@/lib/db";
import { IconDownload } from "@tabler/icons-react";

export const config: TableConfig<Product> = {
	api: {
		params: {
			populate: "category,supplier,variants",
			depth: 2,
			limit: 10,
		},
		model: "products",
	},
	columns: [
		{
			accessorKey: "name",
			headerFilterType: "text",
		},
		{
			accessorKey: "description",
			headerFilterType: "text",
		},
		{
			accessorKey: "category.name",
			headerLabel: "Category",
		},
		{
			accessorKey: "supplier.name",
			headerLabel: "Supplier",
		},
		{
			accessorKey: "price",
			cellType: "currency",
			headerFilterType: "range",
		},
		{
			accessorKey: "createdAt",
			cellType: "date",
			headerFilterType: "dateRange",
		},
	],
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
			action: (row: Product) => {
				console.log("Exporting:", row);
			},
			variant: "outline" as const,
		},
	],
	bulkActions: [
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: Product[]) => {
				console.log("Exporting:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
};

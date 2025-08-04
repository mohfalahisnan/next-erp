import { TableConfig } from "@/components/data-table/data-table";
import { Project } from "@/lib/db";
import { IconDownload } from "@tabler/icons-react";

export const config: TableConfig<Project> = {
	api: {
		params: {
			populate: "department,manager",
			depth: 2,
			limit: 10,
		},
		model: "projects",
	},
	columns: [		{
			accessorKey: "name",
			headerFilterType: "text",
		},		{
			accessorKey: "description",
			headerFilterType: "text",
		},		{
			accessorKey: "manager.name",
			headerLabel: "Manager",
		},		{
			accessorKey: "department.name",
			headerLabel: "Department",
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
			action: (row: Project) => {
				console.log("Exporting:", row);
			},
			variant: "outline" as const,
		},
	],
	bulkActions: [
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: Project[]) => {
				console.log("Exporting:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
};

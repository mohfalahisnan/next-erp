import { TableConfig } from "@/components/data-table/data-table";
import { Role } from "@prisma/client";
import { IconDownload } from "@tabler/icons-react";

export const config: TableConfig<Role> = {
	api: {
		params: {
			populate: "department",
			depth: 2,
			limit: 10,
		},
		model: "roles",
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
			accessorKey: "department.name",
			headerLabel: "Department",
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
		filterOptions: [
		],
		
	},
	withActions: true,
	withSelect: true,
	customActions: [
		{
			label: "Export Data",
			icon: <IconDownload className="h-4 w-4" />,
			action: (row: Role) => {
				console.log("Exporting:", row);
			},
			variant: "outline" as const,
		},
	],
	bulkActions: [
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: Role[]) => {
				console.log("Exporting:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
	form: {
		fields: [
			{
				accessorKey: "name",
				config: {
					type: "text",
					placeholder: "Enter role name",
					validation: {
						required: true,
					},
				},
			},
			{
				accessorKey: "description",
				config: {
					type: "text",
					placeholder: "Enter role description",
				},
			},
		],
	},
};

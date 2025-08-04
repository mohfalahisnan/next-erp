import { TableConfig } from "@/components/data-table/data-table";
import { Department } from "@/lib/db";
import { IconArchive, IconDownload, IconPrinter } from "@tabler/icons-react";

export const config: TableConfig<Department> = {
	api: {
		params: {
			populate: "manager,users",
			depth: 2,
			limit: 10,
		},
		model: "departments",
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
			accessorKey: "manager.name",
			headerLabel: "Manager",
		},
		{
			accessorKey: "budget",
			cellType: "currency",
			headerFilterType: "range",
		},
		{
			accessorKey: "createdAt",
			cellType: "date",
			headerFilterType: "dateRange",
		},
	],
	form: {
		fields: [
			{
				accessorKey: "name",
				config: {
					type: "text",
					placeholder: "Enter department name",
					validation: {
						required: true,
					},
				},
			},
			{
				accessorKey: "description",
				config: {
					type: "textarea",
					placeholder: "Enter department description",
				},
			},
			{
				accessorKey: "managerId",
				config: {
					type: "dynamic-select",
					model: "user",
					valueKey: "id",
					labelKey: "name",
					label: "Manager",
				},
			},
			{
				accessorKey: "budget",
				config: {
					type: "number",
					label: "Budget",
					placeholder: "Enter budget amount",
				},
			},
		],
	},
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
			action: (row: Department) => {
				console.log("Exporting department:", row);
			},
			variant: "outline" as const,
		},
		{
			label: "Archive Department",
			icon: <IconArchive className="h-4 w-4" />,
			action: (row: Department) => {
				console.log("Archiving department:", row);
			},
			variant: "destructive" as const,
		},
	],
	bulkActions: [
		{
			label: "Print Selected",
			icon: <IconPrinter className="h-4 w-4" />,
			action: (selectedRows: Department[]) => {
				console.log("Printing departments:", selectedRows);
			},
			requireSelection: true,
			variant: "default" as const,
		},
		{
			label: "Export Selected",
			icon: <IconDownload className="h-4 w-4" />,
			action: (selectedRows: Department[]) => {
				console.log("Exporting departments:", selectedRows);
			},
			requireSelection: true,
			variant: "outline" as const,
		},
	],
};
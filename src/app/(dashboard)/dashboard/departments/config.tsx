import { TableConfig } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Department } from "@prisma/client";

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
			accessorKey: "isActive",
			headerLabel:"Active",
			renderCell(props) {
				return <Badge showIcon variant={props.getValue() === true ? "active" : "inactive"}>{props.getValue() === true ? "Active" : "Inactive"}</Badge>
			},
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
				accessorKey: "isActive",
				config: {
					type: "checkbox",
					label: "Active",
					// defaultValue: true,
				},
			},
		],
	},
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
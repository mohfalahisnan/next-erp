import { TableConfig } from '@/components/data-table/data-table';
import { Warehouse } from '@prisma/client';
import { IconArchive, IconDownload, IconPrinter } from '@tabler/icons-react';

export const config: TableConfig<Warehouse> = {
	api: {
		params: {
			populate: 'manager',
			depth: 2,
		},
		model: 'warehouses',
	},
	columns: [
		{
			accessorKey: 'name',
			headerFilterType: 'text',
		},
		{
			accessorKey: 'code',
			headerFilterType: 'text',
		},
		{
			accessorKey: 'address',
			headerFilterType: 'text',
		},
		{
			accessorKey: 'city',
			headerFilterType: 'text',
		},
		{
			accessorKey: 'state',
			headerFilterType: 'text',
		},
		{
			accessorKey: 'manager.name',
			headerLabel: 'Manager',
		},
		{
			accessorKey: 'capacity',
			cellType: 'text',
			headerFilterType: 'range',
		},
		{
			accessorKey: 'isActive',
			headerLabel: 'Status',
			cellType: 'enum',
			headerFilterType: 'select',
			filterOptions: [
				{
					label: 'Active',
					value: 'true',
				},
				{ label: 'Inactive', value: 'false' },
			],
			renderCell(props) {
				return <div>{props.getValue() ? 'Active' : 'Inactive'}</div>;
			},
		},
		{
			accessorKey: 'createdAt',
			cellType: 'date',
			headerFilterType: 'dateRange',
		},
		{
			accessorKey: 'postalCode',
			headerLabel: 'Postal Code',
			detailsOnly: true,
		},
		{
			accessorKey: 'country',
			detailsOnly: true,
		},
		{
			accessorKey: 'phone',
			detailsOnly: true,
		},
		{
			accessorKey: 'email',
			cellType: 'email',
			detailsOnly: true,
		},
		{
			accessorKey: 'updatedAt',
			cellType: 'date',
			headerFilterType: 'dateRange',
			detailsOnly: true,
		},
	],
	form: {
		fields: [
			{
				accessorKey: 'name',
				config: {
					type: 'text',
					placeholder: 'Enter warehouse name',
					validation: {
						required: true,
					},
				},
			},
			{
				accessorKey: 'code',
				config: {
					type: 'text',
					placeholder: 'Enter warehouse code',
					validation: {
						required: true,
					},
				},
			},
			{
				accessorKey: 'address',
				config: {
					type: 'textarea',
					placeholder: 'Enter warehouse address',
					validation: {
						required: true,
					},
				},
			},
			{
				accessorKey: 'city',
				config: {
					type: 'text',
					placeholder: 'Enter city',
					validation: {
						required: true,
					},
				},
			},
			{
				accessorKey: 'state',
				config: {
					type: 'text',
					placeholder: 'Enter state',
					validation: {
						required: true,
					},
				},
			},
			{
				accessorKey: 'postalCode',
				config: {
					type: 'text',
					label: 'Postal Code',
					placeholder: 'Enter postal code',
				},
			},
			{
				accessorKey: 'country',
				config: {
					type: 'text',
					placeholder: 'Enter country',
					validation: {
						required: true,
					},
				},
			},
			{
				accessorKey: 'phone',
				config: {
					type: 'number',
					placeholder: 'Enter phone number',
				},
			},
			{
				accessorKey: 'email',
				config: {
					type: 'email',
					placeholder: 'Enter email address',
				},
			},
			{
				accessorKey: 'managerId',
				config: {
					type: 'dynamic-select',
					model: 'user',
					valueKey: 'id',
					labelKey: 'name',
					label: 'Manager',
				},
			},
			{
				accessorKey: 'capacity',
				config: {
					type: 'number',
					label: 'Capacity',
					placeholder: 'Enter warehouse capacity',
				},
			},
			{
				accessorKey: 'isActive',
				config: {
					type: 'checkbox',
					label: 'Active',
				},
			},
		],
	},
	headerProps: {
		dateColumnId: 'createdAt',
		filterDate: true,
		filterOptions: [
			{
				accessorKey: 'isActive',
				label: 'Status',
				values: [
					{
						label: 'Active',
						value: 'true',
					},
					{
						label: 'Inactive',
						value: 'false',
					},
				],
			},
		],
		showCreateButton: true,
	},
	withActions: true,
	withSelect: true,
	customActions: [],
	bulkActions: [
		{
			label: 'Print Selected',
			icon: <IconPrinter className='h-4 w-4' />,
			action: (selectedRows: Warehouse[]) => {
				console.log(
					'Printing warehouses:',
					selectedRows.map((w) => w.name)
				);
				// Add print logic here
			},
			requireSelection: true,
			variant: 'default' as const,
		},
		{
			label: 'Export Selected',
			icon: <IconDownload className='h-4 w-4' />,
			action: (selectedRows: Warehouse[]) => {
				console.log(
					'Exporting warehouses:',
					selectedRows.map((w) => w.name)
				);
				// Add export logic here
			},
			requireSelection: true,
			variant: 'outline' as const,
		},
		{
			label: 'Deactivate Selected',
			icon: <IconArchive className='h-4 w-4' />,
			action: (selectedRows: Warehouse[]) => {
				console.log(
					'Deactivating warehouses:',
					selectedRows.map((w) => w.name)
				);
				// Add bulk deactivation logic here
			},
			visible: (selectedRows: Warehouse[]) =>
				selectedRows.some((warehouse) => warehouse.isActive),
			requireSelection: true,
			variant: 'destructive' as const,
		},
	],
};

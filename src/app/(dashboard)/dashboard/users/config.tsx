import { TableConfig } from '@/components/data-table/data-table';
import { User } from '@prisma/client';

import {
	IconArchive,
	IconDownload,
	IconMail,
	IconPrinter,
	IconUserCheck,
} from '@tabler/icons-react';

export const config: TableConfig<User> = {
	api: {
		params: {
			populate: 'department',
			depth: 2,
			limit: 10,
		},
		model: 'user',
	},
	columns: [
		{
			accessorKey: 'name',
			headerFilterType: 'text',
		},
		{
			accessorKey: 'email',
			cellType: 'email',
		},
		{
			accessorKey: 'department.name',
			headerLabel: 'Department',
		},
		{
			accessorKey: 'position',
			headerFilterType: 'text',
		},
		{
			accessorKey: 'salary',
			cellType: 'currency',
			headerFilterType: 'range',
		},
		{
			accessorKey: 'status',
			cellType: 'enum',
			headerFilterType: 'select',
			filterOptions: [
				{ label: 'Active', value: 'Active' },
				{ label: 'Inactive', value: 'Inactive' },
				{ label: 'Pending', value: 'Pending' },
			],
		},
		{
			accessorKey: 'createdAt',
			cellType: 'date',
			headerFilterType: 'dateRange',
		},
		{
			accessorKey: 'hireDate',
			cellType: 'date',
			headerFilterType: 'dateRange',
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
					placeholder: 'Enter your name',
					validation: {
						required: true,
					},
				},
			},
			{
				accessorKey: 'email',
				config: {
					type: 'email',
					placeholder: 'Enter your email',
					validation: {
						required: true,
					},
				},
			},
			{
				accessorKey: 'roleId',

				config: {
					type: 'dynamic-select',
					model: 'roles',
					valueKey: 'id',
					labelKey: 'name',
					label: 'Role',
				},
			},
			{
				accessorKey: 'departmentId',

				config: {
					type: 'dynamic-select',
					model: 'departments',
					valueKey: 'id',
					labelKey: 'name',
					label: 'Department',
				},
			},
			{
				accessorKey: 'position',
				config: {
					type: 'text',
					label: 'Positions',
					placeholder: 'Enter your position',
					validation: {
						required: true,
					},
				},
			},
			{
				accessorKey: 'salary',
				config: {
					type: 'number',
					label: 'Salary',
					placeholder: 'Enter your salary',
					validation: {
						required: true,
					},
				},
			},
			{
				accessorKey: 'hireDate',
				config: {
					type: 'date',
					label: 'Hire Date',
					placeholder: 'Enter your hire date',
					validation: {
						required: true,
					},
				},
			},
		],
	},
	headerProps: {
		dateColumnId: 'createdAt',
		filterDate: true,
		filterOptions: [
			{
				accessorKey: 'status',
				label: 'Status',
				values: [
					{
						label: 'Active',
						value: 'Active',
					},
					{
						label: 'Inactive',
						value: 'Inactive',
					},
					{
						label: 'Pending',
						value: 'Pending',
					},
				],
			},
		],
		showCreateButton: false,
	},
	withActions: true,
	withSelect: true,

	customActions: [
		{
			label: 'Send Email',
			icon: <IconMail className='h-4 w-4' />,
			action: (row: User) => {
				alert(`Sending email to ${row.email}`);
			},
			visible: (row: User) => row.status === 'Active',
			variant: 'default' as const,
		},
		{
			label: 'Export Data',
			icon: <IconDownload className='h-4 w-4' />,
			action: (row: User) => {
				console.log('Exporting data for:', row);
				alert(`Exporting data for ${row.name}`);
			},
			variant: 'outline' as const,
		},
		{
			label: 'Archive User',
			icon: <IconArchive className='h-4 w-4' />,
			action: (row: User) => {
				if (confirm(`Are you sure you want to archive ${row.name}?`)) {
					alert(`Archiving user ${row.name}`);
				}
			},
			visible: (row: User) => row.status !== 'Inactive',
			disabled: (row: User) => row.status === 'Active',
			variant: 'destructive' as const,
		},
		{
			label: 'Activate User',
			icon: <IconUserCheck className='h-4 w-4' />,
			action: (row: User) => {
				alert(`Activating user ${row.name}`);
			},
			visible: (row: User) => row.status !== 'Active',
			variant: 'secondary' as const,
		},
	],
	bulkActions: [
		{
			label: 'Print Selected',
			icon: <IconPrinter className='h-4 w-4' />,
			action: (selectedRows: User[]) => {
				console.log('Printing selected users:', selectedRows);
				// Create a simple print view
				const printWindow = window.open('', '_blank');
				if (printWindow) {
					printWindow.document.write(`
						<html>
							<head>
								<title>Selected Users</title>
								<style>
									body { font-family: Arial, sans-serif; margin: 20px; }
									table { border-collapse: collapse; width: 100%; }
									th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
									th { background-color: #f2f2f2; }
								</style>
							</head>
							<body>
								<table>
									<thead>
										<tr>
											<th>Name</th>
											<th>Email</th>
											<th>Department</th>
											<th>Position</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										${selectedRows
											.map(
												(user: any) => `
											<tr>
												<td>${user.name}</td>
												<td>${user.email}</td>
												<td>${user.department?.name || 'N/A'}</td>
												<td>${user.position}</td>
												<td>${user.status}</td>
											</tr>
										`
											)
											.join('')}
									</tbody>
								</table>
							</body>
						</html>
					`);
					printWindow.document.close();
					printWindow.print();
				}
			},
			requireSelection: true,
			variant: 'default' as const,
		},
		{
			label: 'Export Selected',
			icon: <IconDownload className='h-4 w-4' />,
			action: (selectedRows: User[]) => {
				console.log('Exporting selected users:', selectedRows);
				// Create CSV content
				const csvContent = [
					['Name', 'Email', 'Department', 'Position', 'Status'],
					...selectedRows.map((user: any) => [
						user.name,
						user.email,
						user.department?.name || 'N/A',
						user.position,
						user.status,
					]),
				]
					.map((row) => row.join(','))
					.join('\n');

				// Download CSV file
				const blob = new Blob([csvContent], { type: 'text/csv' });
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `selected-users-${new Date().toISOString().split('T')[0]}.csv`;
				a.click();
				window.URL.revokeObjectURL(url);
			},
			requireSelection: true,
			variant: 'outline' as const,
		},
		{
			label: 'Archive Selected',
			icon: <IconArchive className='h-4 w-4' />,
			action: (selectedRows: User[]) => {
				console.log('Archiving selected users:', selectedRows);
				alert(`Archiving ${selectedRows.length} users`);
			},
			visible: (selectedRows: User[]) =>
				selectedRows.some((user) => user.status !== 'Inactive'),
			disabled: (selectedRows: User[]) =>
				selectedRows.every((user) => user.status === 'Active'),
			requireSelection: true,
			variant: 'destructive' as const,
		},
	],
};

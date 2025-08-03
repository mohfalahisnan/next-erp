"use client";

import {
	type CellContext,
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type HeaderContext,
	useReactTable,
} from "@tanstack/react-table";
import { parseAsInteger, useQueryStates } from "nuqs";
import React from "react";
import type { z } from "zod";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	type UseDynamicDataOptions,
	useDynamicData,
} from "@/hooks/use-dynamic-data";
import axios from "@/lib/axios";
import { DataTableProvider, useDataTable } from "./data-table-context";
import {
	DataTableDeleteDialog,
	DataTableForm,
	DataTableViewDialog,
} from "./data-table-form";
import DataTableHeader, {
	type DataTableHeaderProps,
} from "./data-table-header";
import type { DataTablePaginationProps } from "./data-table-pagination";
import DataTablePagination from "./data-table-pagination";
import { createColumns } from "./utils/column";

// Custom filter function for date range
// Improved type definitions with better naming and structure
type StaticInputType =
	| "text"
	| "email"
	| "select"
	| "number"
	| "date"
	| "textarea"
	| "dateRange"
	| "richText"
	| "tags"
	| "checkbox";

type DynamicInputType = "dynamic-select";

export type InputType = StaticInputType | DynamicInputType;

// Reusable option type
export type SelectOption = {
	label: string;
	value: string | number;
	disabled?: boolean;
};

// Validation configuration
export type ValidationConfig = {
	required?: boolean;
	min?: number;
	max?: number;
	pattern?: RegExp;
	custom?: (value: any) => string | null;
};

// Base form configuration
type BaseFormConfig = {
	label?: string;
	placeholder?: string;
	hide?: boolean;
	options?: SelectOption[];
	validation?: ValidationConfig;
};

// Type-specific configurations
type StaticFormConfig = BaseFormConfig & {
	type: StaticInputType;
};

type DynamicFormConfig = BaseFormConfig & {
	type: DynamicInputType;
	model: string;
	valueKey: string;
	labelKey: string;
	// Enhanced options for dynamic selects
	searchable?: boolean;
	multiple?: boolean;
	clearable?: boolean;
};

export type FormConfig = StaticFormConfig | DynamicFormConfig;

export type CellType =
	| "currency"
	| "status"
	| "action"
	| "text"
	| "date"
	| "select"
	| "email"
	| "enum";

export type HeaderFilterType =
	| "text"
	| "select"
	| "date"
	| "dateRange"
	| "enum"
	| "range"
	| "number"
	| "boolean"
	| "multiSelect";

// Separate column configuration for table display
export type ColumnConfig<T> = {
	// Header configuration
	headerProps?: React.HTMLAttributes<HTMLDivElement>;
	headerFilterType?: HeaderFilterType;
	renderHeader?: (props: HeaderContext<T, unknown>) => React.JSX.Element;
	headerLabel?: string;
	filterOptions?: SelectOption[];

	// Cell configuration
	cellType?: CellType;
	cellProps?: React.HTMLAttributes<HTMLDivElement>;
	renderCell?: (props: CellContext<T, unknown>) => React.JSX.Element;

	// Display control
	tableOnly?: boolean;
	detailsOnly?: boolean;
} & ColumnDef<T, any>;

// Separate form field configuration
export type FormFieldConfig = {
	accessorKey: string;
	config: FormConfig;
	validation?: ValidationConfig;
	formOnly?: boolean;
};

export type HeaderTableConfig<T> = {
	search?: {
		accessorKey?: keyof T;
		placeholder?: string;
		hide?: boolean;
	};
	filterOptions?: {
		accessorKey?: keyof T;
		filterType?: HeaderFilterType;
	};
	hideColumnVisibility?: boolean;
};

// Enhanced action configuration with permissions and variants
export type ActionPermission = {
	edit?: boolean | ((row: any) => boolean);
	delete?: boolean | ((row: any) => boolean);
	view?: boolean | ((row: any) => boolean);
	copyId?: boolean;
};

export type CustomAction<T> = {
	label: string;
	icon: React.ReactNode;
	action: (row: T) => void | Promise<void>;
	visible?: (row: T) => boolean;
	disabled?: (row: T) => boolean;
	variant?: "default" | "destructive" | "outline" | "secondary";
};

export type BulkAction<T> = {
	label: string;
	icon: React.ReactNode;
	action: (selectedRows: T[]) => void | Promise<void>;
	visible?: (selectedRows: T[]) => boolean;
	disabled?: (selectedRows: T[]) => boolean;
	variant?: "default" | "destructive" | "outline" | "secondary";
	requireSelection?: boolean;
};

// API configuration with better typing
export type ApiConfig =
	| { endpoint: string; model?: never }
	| { endpoint?: never; model: string };

// Enhanced schema configuration
export type SchemaConfig = {
	create?: z.ZodSchema;
	update?: z.ZodSchema;
};

// Backward compatibility type that combines column and form config
export type LegacyColumnConfig<T> = ColumnConfig<T> & {
	// Form configuration (deprecated - use TableConfig.form.fields instead)
	form?: FormConfig;
	formOnly?: boolean;
	validation?: ValidationConfig;
};

export type TableConfig<T> = {
	// Table configuration
	columns: ColumnConfig<T>[];
	header?: HeaderTableConfig<T>;
	pagination?: Omit<DataTablePaginationProps<T>, "table">;

	// Form configuration
	form?: {
		fields: FormFieldConfig[];
		schema?: SchemaConfig;
	};

	// Action configuration
	withSelect?: boolean;
	withActions?: boolean;
	actions?: ActionPermission;
	customActions?: CustomAction<T>[];
	bulkActions?: BulkAction<T>[];

	headerProps?: Omit<DataTableHeaderProps, "table">;

	// Enhanced API configuration
	api: Omit<UseDynamicDataOptions<T>, "endpoint" | "model"> & ApiConfig;

	// Enhanced schema configuration (deprecated - use form.schema instead)
	schema?: SchemaConfig;
};

export function DynamicDataTable<T>(tableConfig: TableConfig<T>) {
	// Convert legacy column config to new format if needed
	const normalizedConfig = React.useMemo(() => {
		const config = { ...tableConfig };

		// If using legacy format, convert to new format
		if (
			!config.form?.fields &&
			config.columns.some((col: any) => col.form || col.formOnly)
		) {
			const formFields: FormFieldConfig[] = [];
			const normalizedColumns: ColumnConfig<T>[] = [];

			config.columns.forEach((col: any) => {
				// Extract form configuration (exclude detailsOnly columns from form)
				if (col.form && col.accessorKey && !col.detailsOnly) {
					formFields.push({
						accessorKey: String(col.accessorKey),
						config: col.form,
						validation: col.validation,
						formOnly: col.formOnly,
					});
				}

				// Create clean column config (remove form-related properties)
				if (!col.formOnly) {
					const { form, formOnly: _formOnly, validation, ...cleanCol } = col;
					normalizedColumns.push(cleanCol);
				}
			});

			config.columns = normalizedColumns;
			config.form = {
				fields: formFields,
				schema: config.schema,
			};
		}

		return config;
	}, [tableConfig]);

	return (
		<DataTableProvider initialConfig={normalizedConfig}>
			<DataTableContent<T> />
		</DataTableProvider>
	);
}

function DataTableContent<T>() {
	const {
		tableConfig,
		sorting,
		setSorting,
		columnFilters,
		setColumnFilters,
		columnVisibility,
		setColumnVisibility,
		rowSelection,
		setRowSelection,
		globalFilter,
		setGlobalFilter,
		isCreating,
		isEditing,
		editingRow,
		isDeleting,
		deletingRow,
		isViewing,
		viewingRow,
		closeAllModals,
		refreshData,
		setRefreshData,
	} = useDataTable<T>();

	// Server-side pagination state with URL synchronization
	const [pagination, setPagination] = useQueryStates({
		pageIndex: parseAsInteger.withDefault(0),
		pageSize: parseAsInteger.withDefault(10),
	});

	// Build server-side query parameters
	const queryParams = React.useMemo(() => {
		// Start with original config params to preserve existing configuration
		const params: Record<string, string | number> = {
			...tableConfig.api.params,
			page: pagination.pageIndex + 1,
			limit: pagination.pageSize,
		};

		// Add sorting
		if (sorting.length > 0) {
			params.sortBy = sorting[0].id;
			params.sortOrder = sorting[0].desc ? "desc" : "asc";
		}

		// Add global search
		if (globalFilter) {
			params.search = globalFilter;
		}

		// Add column filters
		columnFilters.forEach((filter) => {
			const column = tableConfig.columns.find(
				(col: any) => col.accessorKey === filter.id,
			);
			const filterType = column?.headerFilterType;

			if (filterType === "date") {
				// Single date filter - use date range to cover entire day
				if (filter.value) {
					const date = new Date(filter.value as string);
					// Check if date is valid
					if (!isNaN(date.getTime())) {
						// Start of day
						const startOfDay = new Date(
							date.getFullYear(),
							date.getMonth(),
							date.getDate(),
						);
						// End of day
						const endOfDay = new Date(
							date.getFullYear(),
							date.getMonth(),
							date.getDate(),
							23,
							59,
							59,
							999,
						);

						params[`filter_${filter.id}`] = startOfDay.toISOString();
						params[`filter_${filter.id}_op`] = "greater_than_or_equal";
						params[`filter_${filter.id}_to`] = endOfDay.toISOString();
						params[`filter_${filter.id}_to_op`] = "less_than_or_equal";
					}
				}
			} else if (filterType === "dateRange") {
				// Date range filter
				const dateRange = filter.value as { from?: Date; to?: Date };
				if (
					dateRange?.from &&
					dateRange?.to &&
					!isNaN(dateRange.from.getTime()) &&
					!isNaN(dateRange.to.getTime())
				) {
					// Both dates provided - use range
					const startOfDay = new Date(
						dateRange.from.getFullYear(),
						dateRange.from.getMonth(),
						dateRange.from.getDate(),
					);
					const endOfDay = new Date(
						dateRange.to.getFullYear(),
						dateRange.to.getMonth(),
						dateRange.to.getDate(),
						23,
						59,
						59,
						999,
					);

					params[`filter_${filter.id}`] = startOfDay.toISOString();
					params[`filter_${filter.id}_op`] = "greater_than_or_equal";
					params[`filter_${filter.id}_to`] = endOfDay.toISOString();
					params[`filter_${filter.id}_to_op`] = "less_than_or_equal";
				} else if (dateRange?.from && !isNaN(dateRange.from.getTime())) {
					// Only from date - start of day
					const startOfDay = new Date(
						dateRange.from.getFullYear(),
						dateRange.from.getMonth(),
						dateRange.from.getDate(),
					);
					params[`filter_${filter.id}`] = startOfDay.toISOString();
					params[`filter_${filter.id}_op`] = "greater_than_or_equal";
				} else if (dateRange?.to && !isNaN(dateRange.to.getTime())) {
					// Only to date - end of day
					const endOfDay = new Date(
						dateRange.to.getFullYear(),
						dateRange.to.getMonth(),
						dateRange.to.getDate(),
						23,
						59,
						59,
						999,
					);
					params[`filter_${filter.id}`] = endOfDay.toISOString();
					params[`filter_${filter.id}_op`] = "less_than_or_equal";
				}
			} else if (filterType === "range") {
				// Number range filter
				const range = filter.value as { min?: number; max?: number };
				if (range?.min !== undefined && range?.max !== undefined) {
					// Both values provided
					params[`filter_${filter.id}`] = range.min.toString();
					params[`filter_${filter.id}_op`] = "greater_than_or_equal";
					params[`filter_${filter.id}_to`] = range.max.toString();
					params[`filter_${filter.id}_to_op`] = "less_than_or_equal";
				} else if (range?.min !== undefined) {
					// Only min value
					params[`filter_${filter.id}`] = range.min.toString();
					params[`filter_${filter.id}_op`] = "greater_than_or_equal";
				} else if (range?.max !== undefined) {
					// Only max value
					params[`filter_${filter.id}`] = range.max.toString();
					params[`filter_${filter.id}_op`] = "less_than_or_equal";
				}
			} else if (filterType === "select" || filterType === "enum") {
				// Select/enum filter
				params[`filter_${filter.id}`] = filter.value as string;
				params[`filter_${filter.id}_op`] = "equals";
			} else if (filterType === "multiSelect") {
				// Multi-select filter
				const values = filter.value as string[];
				if (values && values.length > 0) {
					params[`filter_${filter.id}`] = values.join(",");
					params[`filter_${filter.id}_op`] = "in";
				}
			} else if (filterType === "boolean") {
				// Boolean filter
				params[`filter_${filter.id}`] = filter.value as string;
				params[`filter_${filter.id}_op`] = "equals";
			} else {
				// Default text/number filter
				params[`filter_${filter.id}`] = filter.value as string;
				params[`filter_${filter.id}_op`] = "contains";
			}
		});

		return params;
	}, [
		tableConfig.api.params,
		pagination,
		sorting,
		globalFilter,
		columnFilters,
	]);

	const query = useDynamicData({
		...tableConfig.api,
		params: queryParams,
		queryKey: [
			"dynamic-data",
			tableConfig.api.model ?? tableConfig.api.endpoint,
			queryParams,
		],
	});

	// Set up refresh function for CRUD operations
	React.useEffect(() => {
		setRefreshData(() => query.refetch);
	}, [query.refetch, setRefreshData]);

	const finalColumns = React.useMemo(
		() => createColumns(tableConfig),
		[tableConfig],
	);

	const table = useReactTable<T>({
		data: (query.data?.data as T[]) || [],
		columns: finalColumns,
		// Server-side state management
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		// Row count from server
		rowCount: query.data?.pagination?.total || 0,
		// State handlers
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		// Only use core row model for server-side data
		getCoreRowModel: getCoreRowModel(),
		// State
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter,
			pagination,
		},
	});

	// CRUD operation handlers
	const handleCreate = async (data: Partial<T>) => {
		try {
			const endpoint = tableConfig.api.endpoint || `/${tableConfig.api.model}`;
			await axios.post(endpoint, data);
			refreshData();
		} catch (error) {
			console.error("Create error:", error);
			throw error;
		}
	};

	const handleUpdate = async (data: Partial<T>) => {
		try {
			if (!editingRow || !(editingRow as any).id) return;
			const endpoint = tableConfig.api.endpoint || `/${tableConfig.api.model}`;
			await axios.patch(`${endpoint}/${(editingRow as any).id}`, data);
			refreshData();
		} catch (error) {
			console.error("Update error:", error);
			throw error;
		}
	};

	const handleDelete = async () => {
		try {
			if (!deletingRow || !(deletingRow as any).id) return;
			const endpoint = tableConfig.api.endpoint || `/${tableConfig.api.model}`;
			await axios.delete(`${endpoint}/${(deletingRow as any).id}`);
			refreshData();
		} catch (error) {
			console.error("Delete error:", error);
			throw error;
		}
	};

	return (
		<div className="w-full">
			<DataTableHeader
				table={table}
				dateColumnId={tableConfig?.headerProps?.dateColumnId || "updatedAt"}
				filterOptions={
					tableConfig?.headerProps?.filterOptions || [
						{
							accessorKey: "status",
							label: "Status",
							multiple: true,
							values: [
								{
									label: "Pending",
									value: "pending",
								},
								{
									label: "Processing",
									value: "processing",
								},
								{
									label: "Success",
									value: "success",
								},
								{
									label: "Failed",
									value: "failed",
								},
							],
						},
					]
				}
				{...tableConfig.headerProps}
			/>
			
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="bg-accent">
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{query.isLoading ? (
							Array.from({ length: pagination.pageSize }).map((_, index) => (
								<TableRow key={index}>
									{Array.from({ length: finalColumns.length }).map(
										(_, cellIndex) => (
											<TableCell key={cellIndex} className="h-12">
												<div className="flex items-center space-x-2">
													<div className="h-4 w-full animate-pulse rounded bg-muted" />
												</div>
											</TableCell>
										),
									)}
								</TableRow>
							))
						) : query.isError ? (
							<TableRow>
								<TableCell
									colSpan={finalColumns.length}
									className="h-24 text-center text-red-500"
								>
									Error loading data. Please try again.
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={finalColumns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination
				table={table}
				paginationData={query.data?.pagination}
			/>

			{/* CRUD Forms and Dialogs */}

			<DataTableForm
				mode={isCreating ? "create" : "edit"}
				open={isCreating || isEditing}
				onClose={closeAllModals}
				onSubmit={isCreating ? handleCreate : handleUpdate}
			/>

			<DataTableDeleteDialog
				open={isDeleting}
				onClose={closeAllModals}
				onConfirm={handleDelete}
				item={deletingRow}
			/>

			<DataTableViewDialog
				open={isViewing}
				onClose={closeAllModals}
				item={viewingRow}
				columns={tableConfig.columns.map((col: any) => ({
					accessorKey: col.accessorKey as string,
					headerLabel: col.headerLabel || (col.header as string),
					cellType: col.cellType,
					detailsOnly: col.detailsOnly,
				}))}
			/>
		</div>
	);
}

'use client';

import type {
	ColumnFiltersState,
	SortingState,
	VisibilityState,
} from '@tanstack/react-table';
import { parseAsJson, parseAsString, useQueryState } from 'nuqs';
import { createContext, type ReactNode, useContext, useState } from 'react';
import type { TableConfig } from './data-table';

interface DataTableContextValue<T = any> {
	// Table configuration
	tableConfig: TableConfig<T>;
	setTableConfig: (config: TableConfig<T>) => void;

	// Table state
	sorting: SortingState;
	setSorting: (
		sorting: SortingState | ((prev: SortingState) => SortingState)
	) => void;
	columnFilters: ColumnFiltersState;
	setColumnFilters: (
		filters:
			| ColumnFiltersState
			| ((prev: ColumnFiltersState) => ColumnFiltersState)
	) => void;
	columnVisibility: VisibilityState;
	setColumnVisibility: (
		visibility:
			| VisibilityState
			| ((prev: VisibilityState) => VisibilityState)
	) => void;
	rowSelection: Record<string, boolean>;
	setRowSelection: (
		selection:
			| Record<string, boolean>
			| ((prev: Record<string, boolean>) => Record<string, boolean>)
	) => void;
	globalFilter: string;
	setGlobalFilter: (filter: string) => void;

	// CRUD operations state
	isCreating: boolean;
	setIsCreating: (creating: boolean) => void;
	isEditing: boolean;
	setIsEditing: (editing: boolean) => void;
	editingRow: T | null;
	setEditingRow: (row: T | null) => void;
	isDeleting: boolean;
	setIsDeleting: (deleting: boolean) => void;
	deletingRow: T | null;
	setDeletingRow: (row: T | null) => void;
	isViewing: boolean;
	setIsViewing: (viewing: boolean) => void;
	viewingRow: T | null;
	setViewingRow: (row: T | null) => void;

	// Form operations
	openCreateForm: () => void;
	openEditForm: (row: T) => void;
	openDeleteDialog: (row: T) => void;
	openViewDialog: (row: T) => void;
	closeAllModals: () => void;

	// Data refresh
	refreshData: () => void;
	setRefreshData: (refresh: () => void) => void;
}

const DataTableContext = createContext<DataTableContextValue | null>(null);

export function useDataTable<T = any>(): DataTableContextValue<T> {
	const context = useContext(DataTableContext);
	if (!context) {
		throw new Error('useDataTable must be used within a DataTableProvider');
	}
	return context as DataTableContextValue<T>;
}

interface DataTableProviderProps<T> {
	children: ReactNode;
	initialConfig: TableConfig<T>;
}

export function DataTableProvider<T>({
	children,
	initialConfig,
}: DataTableProviderProps<T>) {
	// Table configuration
	const [tableConfig, setTableConfig] =
		useState<TableConfig<T>>(initialConfig);

	// Table state with URL synchronization
	const [sorting, setSorting] = useQueryState(
		'sort',
		parseAsJson((value) => value as SortingState).withDefault([])
	);
	const [columnFilters, setColumnFilters] = useQueryState(
		'filters',
		parseAsJson((value) => value as ColumnFiltersState).withDefault([])
	);
	const [columnVisibility, setColumnVisibility] = useQueryState(
		'visibility',
		parseAsJson((value) => value as VisibilityState).withDefault({})
	);
	const [rowSelection, setRowSelection] = useQueryState(
		'selection',
		parseAsJson((value) => value as Record<string, boolean>).withDefault({})
	);
	const [globalFilter, setGlobalFilter] = useQueryState(
		'search',
		parseAsString.withDefault('')
	);

	// CRUD operations state
	const [isCreating, setIsCreating] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingRow, setEditingRow] = useState<T | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deletingRow, setDeletingRow] = useState<T | null>(null);
	const [isViewing, setIsViewing] = useState(false);
	const [viewingRow, setViewingRow] = useState<T | null>(null);

	// Data refresh function
	const [refreshData, setRefreshData] = useState<() => void>(() => () => {});

	// Form operations
	const openCreateForm = () => {
		setIsCreating(true);
		setEditingRow(null);
	};

	const openEditForm = (row: T) => {
		setIsEditing(true);
		setEditingRow(row);
	};

	const openDeleteDialog = (row: T) => {
		setIsDeleting(true);
		setDeletingRow(row);
	};

	const openViewDialog = (row: T) => {
		setIsViewing(true);
		setViewingRow(row);
	};

	const closeAllModals = () => {
		setIsCreating(false);
		setIsEditing(false);
		setIsDeleting(false);
		setIsViewing(false);
		setEditingRow(null);
		setDeletingRow(null);
		setViewingRow(null);
	};

	const value: DataTableContextValue<T> = {
		// Table configuration
		tableConfig,
		setTableConfig,

		// Table state
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

		// CRUD operations state
		isCreating,
		setIsCreating,
		isEditing,
		setIsEditing,
		editingRow,
		setEditingRow,
		isDeleting,
		setIsDeleting,
		deletingRow,
		setDeletingRow,
		isViewing,
		setIsViewing,
		viewingRow,
		setViewingRow,

		// Form operations
		openCreateForm,
		openEditForm,
		openDeleteDialog,
		openViewDialog,
		closeAllModals,

		// Data refresh
		refreshData,
		setRefreshData,
	};

	return (
		<DataTableContext.Provider value={value}>
			{children}
		</DataTableContext.Provider>
	);
}

export { DataTableContext };

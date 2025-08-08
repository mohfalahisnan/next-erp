import type { Table } from '@tanstack/react-table';

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../ui/pagination';

export interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	allowPageSizeChange?: boolean;
	pageSizeOptions?: number[];
	showTotalCount?: boolean;
	showSelectedCount?: boolean;
	maxVisiblePages?: number;
	paginationData?: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}

function DataTablePagination<TData>({
	table,
	maxVisiblePages = 5,
	showSelectedCount = true,
	showTotalCount = true,
	pageSizeOptions = [10, 20, 30, 40, 50],
	paginationData,
}: DataTablePaginationProps<TData>) {
	// Use paginationData if provided, otherwise fall back to table state
	const currentPage =
		paginationData?.page ?? table.getState().pagination.pageIndex + 1;
	const totalPages = paginationData?.pages ?? table.getPageCount();
	const totalRows = paginationData?.total ?? table.getRowCount();
	const pageSize =
		paginationData?.limit ?? table.getState().pagination.pageSize;

	// Generate page numbers to display
	const generatePageNumbers = () => {
		const pages: (number | string)[] = [];
		const halfVisible = Math.floor(maxVisiblePages / 2);

		if (totalPages <= maxVisiblePages) {
			// Show all pages if total is less than max visible
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			const start = Math.max(2, currentPage - halfVisible);
			const end = Math.min(totalPages - 1, currentPage + halfVisible);

			// Add ellipsis after first page if needed
			if (start > 2) {
				pages.push('ellipsis-start');
			}

			// Add middle pages
			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			// Add ellipsis before last page if needed
			if (end < totalPages - 1) {
				pages.push('ellipsis-end');
			}

			// Always show last page
			if (totalPages > 1) {
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = generatePageNumbers();

	return (
		<div className='flex items-center justify-between space-x-2 py-4'>
			{showSelectedCount && (
				<div className='text-muted-foreground flex-1 text-sm'>
					{table.getSelectedRowModel().rows.length} of {totalRows}{' '}
					row(s) selected.
				</div>
			)}
			<div className='text-muted-foreground flex items-center gap-2 text-sm'>
				{showTotalCount && (
					<span>
						Page {currentPage} of {totalPages} ({totalRows} total
						rows)
					</span>
				)}
				<select
					value={pageSize}
					onChange={(e) => {
						// Clear row selections when changing page size
						table.toggleAllRowsSelected(false);
						table.setPageSize(Number(e.target.value));
						// Reset to first page when changing page size
						if (paginationData) {
							table.setPageIndex(0);
						}
					}}
					className='h-8 rounded-md border border-input bg-background px-2'
				>
					{pageSizeOptions.map((size) => (
						<option key={size} value={size}>
							{size} rows
						</option>
					))}
				</select>
			</div>
			<div className='space-x-2'>
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => {
									// Clear row selections when navigating
									table.toggleAllRowsSelected(false);
									if (paginationData) {
										// For server-side pagination, check against current page
										if (currentPage > 1) {
											table.setPageIndex(currentPage - 2); // Convert to 0-based
										}
									} else {
										table.previousPage();
									}
								}}
								aria-disabled={
									paginationData
										? currentPage <= 1
										: !table.getCanPreviousPage()
								}
								className={
									(
										paginationData
											? currentPage <= 1
											: !table.getCanPreviousPage()
									)
										? 'pointer-events-none opacity-50'
										: 'cursor-pointer'
								}
							/>
						</PaginationItem>
						{pageNumbers.map((page) => {
							if (typeof page === 'string') {
								return (
									<PaginationItem key={page}>
										<PaginationEllipsis />
									</PaginationItem>
								);
							}
							return (
								<PaginationItem key={page}>
									<PaginationLink
										onClick={() => {
											// Clear row selections when navigating
											table.toggleAllRowsSelected(false);
											if (paginationData) {
												// For server-side pagination, use 1-based page index
												table.setPageIndex(page - 1);
											} else {
												// For client-side pagination, use 0-based page index
												table.setPageIndex(page - 1);
											}
										}}
										isActive={currentPage === page}
										className='cursor-pointer'
									>
										{page}
									</PaginationLink>
								</PaginationItem>
							);
						})}
						<PaginationItem>
							<PaginationNext
								onClick={() => {
									// Clear row selections when navigating
									table.toggleAllRowsSelected(false);
									if (paginationData) {
										// For server-side pagination, check against total pages
										if (currentPage < totalPages) {
											table.setPageIndex(currentPage); // Convert to 0-based
										}
									} else {
										table.nextPage();
									}
								}}
								aria-disabled={
									paginationData
										? currentPage >= totalPages
										: !table.getCanNextPage()
								}
								className={
									(
										paginationData
											? currentPage >= totalPages
											: !table.getCanNextPage()
									)
										? 'pointer-events-none opacity-50'
										: 'cursor-pointer'
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}

export default DataTablePagination;

import type { ColumnDef, FilterFn } from '@tanstack/react-table';
import type { DateRange } from 'react-day-picker';
import type { TableConfig } from '../data-table';
import {
	CellAction,
	CellBoolean,
	CellCurrrency,
	CellDate,
	CellEnum,
	CellSelect,
	CellStatus,
	CellText,
} from '../data-table-cell';
import { DataTableHead, HeaderSelect } from '../data-table-head';

// Custom filter function for date range
const dateRangeFilter: FilterFn<any> = (row, columnId, value: DateRange) => {
	if (!value || (!value.from && !value.to)) return true;

	const cellValue = row.getValue(columnId) as Date;
	if (!cellValue) return false;

	const cellDate = new Date(cellValue);
	cellDate.setHours(0, 0, 0, 0); // Reset time for date comparison

	if (value.from && value.to) {
		const fromDate = new Date(value.from);
		const toDate = new Date(value.to);
		fromDate.setHours(0, 0, 0, 0);
		toDate.setHours(23, 59, 59, 999);
		return cellDate >= fromDate && cellDate <= toDate;
	}

	if (value.from) {
		const fromDate = new Date(value.from);
		fromDate.setHours(0, 0, 0, 0);
		return cellDate >= fromDate;
	}

	return true;
};

// Custom filter function for number range
const rangeFilter: FilterFn<any> = (
	row,
	columnId,
	value: { min?: number; max?: number }
) => {
	if (!value || (value.min === undefined && value.max === undefined))
		return true;

	const cellValue = row.getValue(columnId) as number;
	if (cellValue === null || cellValue === undefined) return false;

	const numericValue = Number(cellValue);
	if (Number.isNaN(numericValue)) return false;

	if (value.min !== undefined && value.max !== undefined) {
		return numericValue >= value.min && numericValue <= value.max;
	}

	if (value.min !== undefined) {
		return numericValue >= value.min;
	}

	if (value.max !== undefined) {
		return numericValue <= value.max;
	}

	return true;
};

export function createColumns<T>(config: TableConfig<T>): ColumnDef<T>[] {
	const finalColumns: ColumnDef<T>[] = [];

	// Add select column if withSelect is true
	if (config.withSelect) {
		finalColumns.push({
			id: 'select',
			header: (props) => <HeaderSelect {...props} />,
			cell: (props) => <CellSelect {...props} />,
			enableSorting: false,
			enableHiding: false,
		});
	}

	for (const column of config.columns.filter((col) => !col.detailsOnly)) {
		// All columns in the columns array should be displayed in the table
		// formOnly fields are now handled separately in the form.fields array
		// detailsOnly columns are filtered out from table display

		// Create a new ColumnDef object from ColumnConfig
		// Use spread operator to copy all ColumnDef properties
		const columnDef: ColumnDef<T> = {
			...column,
		};

		// Set cell - prioritize renderCell, then cellType, then existing cell
		if (column.renderCell) {
			columnDef.cell = (props) => (
				<div {...column.cellProps}>{column.renderCell?.(props)}</div>
			);
		} else {
			switch (column.cellType) {
				case 'enum':
					columnDef.cell = (props) => (
						<div {...column.cellProps}>
							<CellEnum {...props} />
						</div>
					);
					break;
				case 'currency':
					columnDef.cell = (props) => (
						<div {...column.cellProps}>
							<CellCurrrency {...props} />
						</div>
					);
					break;
				case 'action':
					columnDef.cell = (props) => (
						<div {...column.cellProps}>
							<CellAction {...props} />
						</div>
					);
					break;
				case 'date':
					columnDef.cell = (props) => (
						<div {...column.cellProps}>
							<CellDate {...props} />
						</div>
					);
					break;
				case 'status':
					columnDef.cell = (props) => (
						<div {...column.cellProps}>
							<CellStatus {...props} />
						</div>
					);
					break;
				case 'text':
					columnDef.cell = (props) => (
						<div {...column.cellProps}>
							<CellText {...props} />
						</div>
					);
					break;
				case 'boolean':
					columnDef.cell = (props) => (
						<div {...column.cellProps}>
							<CellBoolean {...props} />
						</div>
					);
					break;
				case 'select':
					columnDef.cell = (props) => (
						<div {...column.cellProps}>
							<CellSelect {...props} />
						</div>
					);
					break;
				default:
					// Use existing cell if provided, otherwise default to CellText
					if (column.cell) {
						columnDef.cell = column.cell;
					} else {
						columnDef.cell = (props) => (
							<div {...column.cellProps}>
								<CellText {...props} />
							</div>
						);
					}
					break;
			}
		}

		// Set header - prioritize headerLabel, then renderHeader, then cellType, then existing header
		if (column.headerLabel) {
			columnDef.header = (props) => (
				<div {...column.headerProps}>
					<DataTableHead {...props} title={column.headerLabel} />
				</div>
			);
		} else if (column.renderHeader) {
			columnDef.header = (props) => (
				<div {...column.headerProps}>
					{column.renderHeader?.(props)}
				</div>
			);
		} else {
			switch (column.cellType) {
				case 'select':
					columnDef.header = (props) => (
						<div {...column.headerProps}>
							<HeaderSelect {...props} />
						</div>
					);
					break;
				default:
					// Use existing header if provided, otherwise default to DataTableHead
					if (column.header && typeof column.header === 'function') {
						columnDef.header = column.header;
					} else if (
						column.header &&
						typeof column.header === 'string'
					) {
						const headerText = column.header;
						columnDef.header = (_props) => (
							<div {...column.headerProps}>{headerText}</div>
						);
					} else {
						columnDef.header = (props) => (
							<div {...column.headerProps}>
								<DataTableHead {...props} />
							</div>
						);
					}
					break;
			}
		}

		// Set filterFn based on headerFilterType
		if (column.headerFilterType === 'range') {
			columnDef.filterFn = rangeFilter;
		} else if (column.headerFilterType === 'dateRange') {
			columnDef.filterFn = dateRangeFilter;
		}

		finalColumns.push(columnDef);
	}

	// Add action column if withActions is true
	if (config.withActions) {
		finalColumns.push({
			id: 'actions',
			header: () => <div className='text-right'>Actions</div>,
			cell: (props) => <CellAction {...props} />,
			enableHiding: false,
			enableSorting: false,
		});
	}

	return finalColumns;
}

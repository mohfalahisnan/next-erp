import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

// Pagination Schema
export const PaginationSchema = z.object({
	page: z.number().min(1),
	limit: z.number().min(1).max(100),
	total: z.number(),
	pages: z.number(),
});

export type Pagination = {
	page: number;
	limit: number;
	total: number;
	pages: number;
};

// Standardized API Response Schema (matching actual API format)
export const ApiResponseSchema = z.object({
	success: z.boolean(),
	data: z.union([z.array(z.unknown()), z.unknown()]), // Can be array or single object
	pagination: PaginationSchema.optional(),
	message: z.string().optional(),
	code: z.number(),
});

// Specific schema for list responses (with pagination)
export const ApiListResponseSchema = z.object({
	success: z.boolean(),
	data: z.array(z.unknown()),
	pagination: PaginationSchema.optional(),
	message: z.string().optional(),
	code: z.number(),
});

// Specific schema for single item responses (CRUD operations)
export const ApiItemResponseSchema = z.object({
	success: z.boolean(),
	data: z.unknown(),
	message: z.string().optional(),
	code: z.number(),
});

export type ApiResponse<T = unknown> = {
	success: boolean;
	data: T[];
	pagination?: Pagination;
	message?: string;
	code: number;
};

// Generic API Error Schema
export const ApiErrorSchema = z.object({
	success: z.literal(false),
	message: z.string(),
	error: z.string().optional(),
	code: z.number(),
});

export type ApiError = {
	success: false;
	message: string;
	error?: string;
	code: number;
};

// Filter Schema
export const FilterSchema = z.object({
	field: z.string(),
	operator: z.enum([
		'eq',
		'ne',
		'gt',
		'gte',
		'lt',
		'lte',
		'contains',
		'startsWith',
		'endsWith',
	]),
	value: z.unknown(),
});

export type Filter = {
	field: string;
	operator:
		| 'eq'
		| 'ne'
		| 'gt'
		| 'gte'
		| 'lt'
		| 'lte'
		| 'contains'
		| 'startsWith'
		| 'endsWith';
	value: unknown;
};

// Sort Schema
export const SortSchema = z.object({
	field: z.string(),
	direction: z.enum(['asc', 'desc']),
});

export type Sort = {
	field: string;
	direction: 'asc' | 'desc';
};

// Query Parameters Schema
export const QueryParamsSchema = z.object({
	page: z.number().min(1).default(1),
	pageSize: z.number().min(1).max(100).default(10),
	search: z.string().optional(),
	filters: z.array(FilterSchema).optional(),
	sort: SortSchema.optional(),
});

export type QueryParams = {
	page?: number;
	pageSize?: number;
	search?: string;
	filters?: Filter[];
	sort?: Sort;
};

// Helper function to create standardized API response
export function createApiResponse<T>(
	data: T[],
	total: number,
	page: number,
	pageSize: number,
	message?: string,
	code?: keyof typeof StatusCodes
): ApiResponse<T> {
	return {
		success: true,
		data,
		pagination: {
			page,
			limit: pageSize,
			total,
			pages: Math.ceil(total / pageSize),
		},
		message,
		code: code ? StatusCodes[code] : StatusCodes.OK,
	};
}

// Helper function to create standardized API error
export function createApiError(
	message: string,
	error?: string,
	code?: keyof typeof StatusCodes
): ApiError {
	return {
		success: false,
		message,
		error,
		code: code ? StatusCodes[code] : StatusCodes.INTERNAL_SERVER_ERROR,
	};
}

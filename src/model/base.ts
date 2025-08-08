// This file defines the BaseEntity class which extends PrismaClient to provide common database operations.
// It includes a method to get a model delegate and a method for paginated find operations.

import { Prisma, PrismaClient } from '@prisma/client';

export type Models = keyof Omit<
	PrismaClient,
	| symbol
	| '$connect'
	| '$use'
	| '$on'
	| '$disconnect'
	| '$executeRaw'
	| '$executeRawUnsafe'
	| '$queryRaw'
	| '$queryRawUnsafe'
	| '$transaction'
	| '$extends'
>;

export type PaginatedResult<T> = {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
};

/**
 * Soft deletes an entity in the database by setting the 'deleted' field to the current timestamp.
 *
 * @param where - The condition to find the entity to be soft deleted.
 * @returns A promise that resolves to the updated entity.
 */
async function softDelete<T>(
	this: T,
	where?: Prisma.Args<T, 'update'>['where']
) {
	const context = Prisma.getExtensionContext(this);
	const result = await (context as any).update({
		where,
		data: {
			deleted: new Date(),
		},
	});
	return result;
}

/**
 * Soft deletes multiple entities in the database by setting the 'deleted' field to the current timestamp.
 *
 * @param where - The condition to find the entities to be soft deleted.
 * @returns A promise that resolves to the count of updated entities.
 */
async function softDeleteMany<T>(
	this: T,
	where?: Prisma.Args<T, 'updateMany'>['where']
) {
	const context = Prisma.getExtensionContext(this);
	const result = await (context as any).updateMany({
		where,
		data: {
			deleted: new Date(),
		},
	});
	return result.count;
}

/**
 * Checks if an entity exists in the database based on the provided criteria.
 *
 * @param where - The condition to find the entity.
 * @param select - The fields to select from the entity.
 * @returns A promise that resolves to a boolean indicating whether the entity exists.
 */
async function exists<T>(
	this: T,
	where: Prisma.Args<T, 'findFirst'>['where'],
	select: Prisma.Args<T, 'findMany'>['select']
): Promise<boolean> {
	const context = Prisma.getExtensionContext(this);

	const result = await (context as any).findFirst({ where, select });
	return result !== null;
}

/**
 * Retrieves a paginated list of entities from the database based on the provided criteria.
 *
 * @param page - The current page number (default is 1).
 * @param pageSize - The number of entities per page (default is 10).
 * @param sort - The sorting order of the entities.
 * @param where - The condition to filter the entities.
 * @param select - The fields to select from the entities.
 * @returns {Promise<T[]>} A promise that resolves to a paginated result containing the entities and pagination details.
 *
 * @example
 * // Example usage:
 * const data = await baseEntity.entity.articles.paginateFindMany({
 *    orderBy:{
 *        createdAt:"desc"
 *    },
 *    page:1,
 *    pageSize:20
 * })
 *
 */
async function paginateFindMany<T>(
	this: T,
	{
		page = 1,
		pageSize = 10,
		orderBy,
		where,
		select,
	}: {
		page?: number;
		pageSize?: number;
		orderBy?: Prisma.Args<T, 'findMany'>['orderBy'];
		where?: Prisma.Args<T, 'findMany'>['where'];
		select?: Prisma.Args<T, 'findMany'>['select'];
	}
): Promise<PaginatedResult<T>> {
	const skip = (page - 1) * pageSize;
	const take = pageSize;

	const context = Prisma.getExtensionContext(this);
	const [data, total] = await Promise.all([
		(context as any).findMany({
			skip,
			take,
			orderBy,
			where,
			select: select,
		}),
		(context as any).count({
			where,
		}),
	]);

	return {
		data: data as T[],
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	};
}

export default class BaseEntity extends PrismaClient {
	entity = this.$extends({
		model: {
			$allModels: {
				softDelete,
				softDeleteMany,
				exists,
				paginateFindMany,
			},
		},
	});
}

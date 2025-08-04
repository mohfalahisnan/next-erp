import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "./db";
import {
	departmentCreateSchema,
	departmentUpdateSchema,
	projectCreateSchema,
	projectUpdateSchema,
	roleCreateSchema,
	roleUpdateSchema,
	userCreateSchema,
	userUpdateSchema,
} from "./db/validations";

const createBasicSchema = (_data: any) => z.object({}).passthrough();
const updateBasicSchema = (_data: any) => z.object({}).passthrough().partial();

interface ModelConfig {
	model: string;
	createSchema: any;
	updateSchema: any;
	relations?: string[];
}

export const modelRegistry: Record<string, ModelConfig> = {
	user: {
		model: "user",
		createSchema: userCreateSchema,
		updateSchema: userUpdateSchema,
		relations: ["department", "role"],
	},
	departments: {
		model: "department",
		createSchema: departmentCreateSchema,
		updateSchema: departmentUpdateSchema,
		relations: ["manager", "users", "projects"],
	},
	roles: {
		model: "role",
		createSchema: roleCreateSchema,
		updateSchema: roleUpdateSchema,
		relations: ["department", "users"],
	},
	projects: {
		model: "project",
		createSchema: projectCreateSchema,
		updateSchema: projectUpdateSchema,
		relations: ["department", "manager"],
	},
	// Warehouse management models
	warehouses: {
		model: "warehouse",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["manager", "inventory", "transfersFrom", "transfersTo", "orders"],
	},
	productCategories: {
		model: "productCategory",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["products"],
	},
	suppliers: {
		model: "supplier",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["products"],
	},
	products: {
		model: "product",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["category", "supplier", "variants"],
	},
	productVariants: {
		model: "productVariant",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["product", "inventory"],
	},
	inventory: {
		model: "inventory",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["productVariant", "warehouse", "movements"],
	},
	inventoryMovements: {
		model: "inventoryMovement",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["inventory", "user"],
	},
	transfers: {
		model: "transfer",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["fromWarehouse", "toWarehouse", "items", "requestedBy", "approvedBy"],
	},
	transferItems: {
		model: "transferItem",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["transfer", "productVariant"],
	},
	customers: {
		model: "customer",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["addresses", "orders"],
	},
	customerAddresses: {
		model: "customerAddress",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["customer"],
	},
	carriers: {
		model: "carrier",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["shipments"],
	},
	orders: {
		model: "order",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["customer", "warehouse", "items", "shipments"],
	},
	orderItems: {
		model: "orderItem",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["order", "productVariant"],
	},
	shipments: {
		model: "shipment",
		createSchema: createBasicSchema({}),
		updateSchema: updateBasicSchema({}),
		relations: ["order", "carrier", "warehouse"],
	},
};

function parseDate(value: any): Date | null {
	if (!value) return null;
	const date = new Date(value);
	return isNaN(date.getTime()) ? null : date;
}

function isDateColumn(key: string): boolean {
	return [
		"createdAt",
		"updatedAt",
		"startDate",
		"endDate",
		"dueDate",
		"orderDate",
		"shippedDate",
		"deliveredDate",
	].includes(key);
}

function buildWhereConditions(filters: Record<string, any>) {
	const where: any = {};

	for (const [key, value] of Object.entries(filters)) {
		if (value === undefined || value === null || value === "") continue;

		if (key === "search") {
			// Handle search across multiple fields
			continue; // Will be handled separately
		}

		// Handle date filters
		if (isDateColumn(key)) {
			const dateValue = parseDate(value);
			if (dateValue) {
				where[key] = dateValue;
			}
			continue;
		}

		// Handle range filters
		if (key.endsWith("_gte")) {
			const field = key.replace("_gte", "");
			if (isDateColumn(field)) {
				const dateValue = parseDate(value);
				if (dateValue) {
					where[field] = { ...where[field], gte: dateValue };
				}
			} else {
				const numValue = Number(value);
				if (!isNaN(numValue)) {
					where[field] = { ...where[field], gte: numValue };
				}
			}
			continue;
		}

		if (key.endsWith("_lte")) {
			const field = key.replace("_lte", "");
			if (isDateColumn(field)) {
				const dateValue = parseDate(value);
				if (dateValue) {
					where[field] = { ...where[field], lte: dateValue };
				}
			} else {
				const numValue = Number(value);
				if (!isNaN(numValue)) {
					where[field] = { ...where[field], lte: numValue };
				}
			}
			continue;
		}

		if (key.endsWith("_gt")) {
			const field = key.replace("_gt", "");
			if (isDateColumn(field)) {
				const dateValue = parseDate(value);
				if (dateValue) {
					where[field] = { ...where[field], gt: dateValue };
				}
			} else {
				const numValue = Number(value);
				if (!isNaN(numValue)) {
					where[field] = { ...where[field], gt: numValue };
				}
			}
			continue;
		}

		if (key.endsWith("_lt")) {
			const field = key.replace("_lt", "");
			if (isDateColumn(field)) {
				const dateValue = parseDate(value);
				if (dateValue) {
					where[field] = { ...where[field], lt: dateValue };
				}
			} else {
				const numValue = Number(value);
				if (!isNaN(numValue)) {
					where[field] = { ...where[field], lt: numValue };
				}
			}
			continue;
		}

		// Handle string contains filters
		if (key.endsWith("_contains")) {
			const field = key.replace("_contains", "");
			where[field] = { contains: value, mode: "insensitive" };
			continue;
		}

		// Handle exact matches
		where[key] = value;
	}

	return where;
}

function buildOrderBy(sort?: string, order?: string) {
	if (!sort) return { createdAt: "desc" };

	const direction = order?.toLowerCase() === "asc" ? "asc" : "desc";
	return { [sort]: direction };
}

function buildIncludeQuery(populate?: string, relations?: string[]) {
	if (!populate || !relations) return {};

	const include: any = {};
	const populateFields = populate.split(",").map((field) => field.trim());

	for (const field of populateFields) {
		if (relations.includes(field)) {
			include[field] = true;
		}
	}

	return include;
}

const modelToQueryMap: Record<string, string> = {
	user: "user",
	departments: "department",
	roles: "role",
	projects: "project",
	warehouses: "warehouse",
	productcategories: "productCategory",
	"product-categories": "productCategory",
	suppliers: "supplier",
	products: "product",
	productvariant: "productVariant",
	productvariants: "productVariant",
	"product-variants": "productVariant",
	inventory: "inventory",
	inventorymovements: "inventoryMovement",
	"inventory-movements": "inventoryMovement",
	transfers: "transfer",
	transferitems: "transferItem",
	"transfer-items": "transferItem",
	customers: "customer",
	customeraddresses: "customerAddress",
	"customer-addresses": "customerAddress",
	carriers: "carrier",
	orders: "order",
	orderitems: "orderItem",
	"order-items": "orderItem",
	shipments: "shipment",
};

export async function createApiHandler(modelName: string) {
	const config = modelRegistry[modelName.toLowerCase()];
	if (!config) {
		throw new Error(`Model ${modelName} not found`);
	}

	const queryKey = modelToQueryMap[modelName.toLowerCase()];
	if (!queryKey) {
		throw new Error(`Query key for model ${modelName} not found`);
	}

	return {
		// GET /api/[model] - List with pagination and filtering
		async GET(request: NextRequest) {
			try {
				const { searchParams } = new URL(request.url);
				const page = parseInt(searchParams.get("page") || "1");
				const limit = parseInt(searchParams.get("limit") || "10");
				const sort =
					searchParams.get("sort") || searchParams.get("sortBy") || "createdAt";
				const order =
					searchParams.get("order") || searchParams.get("sortOrder") || "desc";
				const search = searchParams.get("search");
				const populate = searchParams.get("populate");

				// Build filters
				const filters: Record<string, any> = {};
				for (const [key, value] of searchParams.entries()) {
					if (
						![
							"page",
							"limit",
							"sort",
							"sortBy",
							"order",
							"sortOrder",
							"populate",
							"search",
							"depth",
						].includes(key)
					) {
						// Handle filter parameters
						if (key.startsWith("filter_")) {
							const filterKey = key.replace("filter_", "");
							filters[filterKey] = value;
						} else {
							filters[key] = value;
						}
					}
				}

				// Add search to filters if provided
				if (search) {
					filters.search = search;
				}

				const skip = (page - 1) * limit;
				const where = buildWhereConditions(filters);
				const orderBy = buildOrderBy(sort, order);
				const include = buildIncludeQuery(populate || undefined, config.relations);

				// Handle search across multiple fields for specific models
				if (search && where.search !== undefined) {
					delete where.search;
					// Add model-specific search logic
					if (queryKey === "user") {
						where.OR = [
							{ name: { contains: search, mode: "insensitive" } },
							{ email: { contains: search, mode: "insensitive" } },
						];
					} else if (queryKey === "product") {
						where.OR = [
							{ name: { contains: search, mode: "insensitive" } },
							{ sku: { contains: search, mode: "insensitive" } },
							{ description: { contains: search, mode: "insensitive" } },
						];
					}
				}

				// Get total count
				const total = await (db as any)[queryKey].count({ where });

				// Get data
				const data = await (db as any)[queryKey].findMany({
					where,
					skip,
					take: limit,
					orderBy,
					include,
				});

				return NextResponse.json({
					success: true,
					data,
					pagination: {
						page,
						limit,
						total,
						pages: Math.ceil(total / limit),
					},
				});
			} catch (error) {
				console.error(`Error fetching ${modelName}:`, error);
				return NextResponse.json(
					{ success: false, error: "Internal server error" },
					{ status: 500 },
				);
			}
		},

		// POST /api/[model] - Create new record
		async POST(request: NextRequest) {
			try {
				const body = await request.json();
				console.log('Raw request body:', JSON.stringify(body, null, 2));
				
				// Clean up empty string fields
				if (body.managerId === '') {
					console.log('Removing empty managerId');
					delete body.managerId;
				}
				
				if (body.roleId === '') {
					console.log('Removing empty roleId');
					delete body.roleId;
				}
				
				if (body.departmentId === '') {
					console.log('Removing empty departmentId');
					delete body.departmentId;
				}
				
				// Remove budget field for departments as it's not in the current schema
				if (body.budget !== undefined) {
					console.log('Removing budget field:', body.budget);
					delete body.budget;
				}
				
				console.log('Cleaned request body:', JSON.stringify(body, null, 2));
				const validatedData = config.createSchema.parse(body);

				const result = await (db as any)[queryKey].create({
					data: validatedData,
				});

				return NextResponse.json(
					{
						success: true,
						data: result,
					},
					{ status: 201 },
				);
			} catch (error) {
				console.error(`Error creating ${modelName}:`, error);
				if (error instanceof z.ZodError) {
					return NextResponse.json(
						{
							success: false,
							error: "Validation error",
							details: error.issues,
						},
						{ status: 400 },
					);
				}
				return NextResponse.json(
					{ success: false, error: "Internal server error" },
					{ status: 500 },
				);
			}
		},

		// GET /api/[model]/[id] - Get single record
		async GETById(request: NextRequest, id: string) {
			try {
				const { searchParams } = new URL(request.url);
				const populate = searchParams.get("populate");
				const include = buildIncludeQuery(populate || undefined, config.relations);

				const result = await (db as any)[queryKey].findUnique({
					where: { id },
					include,
				});

				if (!result) {
					return NextResponse.json(
						{ success: false, error: `${modelName} not found` },
						{ status: 404 },
					);
				}

				return NextResponse.json({
					success: true,
					data: result,
				});
			} catch (error) {
				console.error(`Error fetching ${modelName} by ID:`, error);
				return NextResponse.json(
					{ success: false, error: "Internal server error" },
					{ status: 500 },
				);
			}
		},

		// PATCH /api/[model]/[id] - Update record
		async PATCH(request: NextRequest, id: string) {
			try {
				const body = await request.json();
				const validatedData = config.updateSchema.parse(body);

				// Remove undefined values
				const updateData = Object.fromEntries(
					Object.entries(validatedData).filter(
						([_, value]) => value !== undefined,
					),
				);

				if (Object.keys(updateData).length === 0) {
					return NextResponse.json(
						{ success: false, error: "No valid fields to update" },
						{ status: 400 },
					);
				}

				// Add updatedAt timestamp
				updateData.updatedAt = new Date();

				const result = await (db as any)[queryKey].update({
					where: { id },
					data: updateData,
				});

				return NextResponse.json({
					success: true,
					data: result,
				});
			} catch (error: any) {
				console.error(`Error updating ${modelName}:`, error);
				if (error instanceof z.ZodError) {
					return NextResponse.json(
						{
							success: false,
							error: "Validation error",
							details: error.issues,
						},
						{ status: 400 },
					);
				}
				if (error.code === "P2025") {
					return NextResponse.json(
						{ success: false, error: `${modelName} not found` },
						{ status: 404 },
					);
				}
				return NextResponse.json(
					{ success: false, error: "Internal server error" },
					{ status: 500 },
				);
			}
		},

		// DELETE /api/[model]/[id] - Delete record
		async DELETE(_request: NextRequest, id: string) {
			try {

				return NextResponse.json({
					success: true,
					message: `${modelName} deleted successfully`,
				});
			} catch (error: any) {
				console.error(`Error deleting ${modelName}:`, error);
				if (error.code === "P2025") {
					return NextResponse.json(
						{ success: false, error: `${modelName} not found` },
						{ status: 404 },
					);
				}
				return NextResponse.json(
					{ success: false, error: "Internal server error" },
					{ status: 500 },
				);
			}
		},
	};
}

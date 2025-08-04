import {
	and,
	asc,
	count,
	desc,
	eq,
	gt,
	gte,
	like,
	lt,
	lte,
	or,
} from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "./db";
import { 
	departments, 
	projects, 
	roles, 
	user,
	// Warehouse management tables
	warehouses,
	productCategories,
	suppliers,
	products,
	productVariants,
	inventory,
	inventoryMovements,
	transfers,
	transferItems,
	customers,
	customerAddresses,
	carriers,
	orders,
	orderItems,
	shipments
} from "./db/schemas";
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

// Create basic schemas for warehouse tables (using table inference)
const createBasicSchema = (_data:any) => z.object({}).passthrough();
const updateBasicSchema = (_data:any) => z.object({}).passthrough().partial();

// Model configuration
interface ModelConfig {
	table: PgTable;
	createSchema: any;
	updateSchema: any;
	relations?: string[];
	relationMappings?: Record<string, string[]>;
}

// Model registry
export const modelRegistry: Record<string, ModelConfig> = {
	user: {
		table: user,
		createSchema: userCreateSchema,
		updateSchema: userUpdateSchema,
		relations: ["department"],
	},
	departments: {
		table: departments,
		createSchema: departmentCreateSchema,
		updateSchema: departmentUpdateSchema,
		relations: ["manager", "users", "projects"],
	},
	roles: {
		table: roles,
		createSchema: roleCreateSchema,
		updateSchema: roleUpdateSchema,
		relations: ["department"],
	},
	projects: {
		table: projects,
		createSchema: projectCreateSchema,
		updateSchema: projectUpdateSchema,
		relations: ["department", "manager"],
	},
	// Warehouse Management Tables
	warehouses: {
		table: warehouses,
		createSchema: createBasicSchema(warehouses),
		updateSchema: updateBasicSchema(warehouses),
		relations: ["manager", "inventory", "transfers", "orders"],
	},
	productCategories: {
		table: productCategories,
		createSchema: createBasicSchema(productCategories),
		updateSchema: updateBasicSchema(productCategories),
		relations: ["products"],
	},
	suppliers: {
		table: suppliers,
		createSchema: createBasicSchema(suppliers),
		updateSchema: updateBasicSchema(suppliers),
		relations: ["products"],
	},
	products: {
		table: products,
		createSchema: createBasicSchema(products),
		updateSchema: updateBasicSchema(products),
		relations: ["category", "supplier", "variants"],
	},
	productVariants: {
		table: productVariants,
		createSchema: createBasicSchema(productVariants),
		updateSchema: updateBasicSchema(productVariants),
		relations: ["product", "inventory"],
	},
	inventory: {
		table: inventory,
		createSchema: createBasicSchema(inventory),
		updateSchema: updateBasicSchema(inventory),
		relations: ["productVariant", "warehouse", "movements"],
	},
	inventoryMovements: {
		table: inventoryMovements,
		createSchema: createBasicSchema(inventoryMovements),
		updateSchema: updateBasicSchema(inventoryMovements),
		relations: ["inventory", "user"],
	},
	transfers: {
		table: transfers,
		createSchema: createBasicSchema(transfers),
		updateSchema: updateBasicSchema(transfers),
		relations: ["fromWarehouse", "toWarehouse", "items", "requestedBy", "approvedBy"],
	},
	transferItems: {
		table: transferItems,
		createSchema: createBasicSchema(transferItems),
		updateSchema: updateBasicSchema(transferItems),
		relations: ["transfer", "productVariant"],
	},
	customers: {
		table: customers,
		createSchema: createBasicSchema(customers),
		updateSchema: updateBasicSchema(customers),
		relations: ["addresses", "orders"],
	},
	customerAddresses: {
		table: customerAddresses,
		createSchema: createBasicSchema(customerAddresses),
		updateSchema: updateBasicSchema(customerAddresses),
		relations: ["customer"],
	},
	carriers: {
		table: carriers,
		createSchema: createBasicSchema(carriers),
		updateSchema: updateBasicSchema(carriers),
		relations: ["shipments"],
	},
	orders: {
		table: orders,
		createSchema: createBasicSchema(orders),
		updateSchema: updateBasicSchema(orders),
		relations: ["customer", "warehouse", "items", "shipments"],
	},
	orderItems: {
		table: orderItems,
		createSchema: createBasicSchema(orderItems),
		updateSchema: updateBasicSchema(orderItems),
		relations: ["order", "productVariant"],
	},
	shipments: {
		table: shipments,
		createSchema: createBasicSchema(shipments),
		updateSchema: updateBasicSchema(shipments),
		relations: ["order", "carrier", "warehouse"],
	},
};

// Helper function to parse date values
function parseDate(value: any): Date | null {
	if (value instanceof Date) {
		return value;
	}

	if (typeof value === "string") {
		// Handle various date formats
		if (
			value.includes("T") ||
			value.includes("Z") ||
			value.match(/^\d{4}-\d{2}-\d{2}/)
		) {
			const parsed = new Date(value);
			return isNaN(parsed.getTime()) ? null : parsed;
		}

		// Handle MM/DD/YYYY or DD/MM/YYYY formats
		if (value.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
			const parsed = new Date(value);
			return isNaN(parsed.getTime()) ? null : parsed;
		}

		// Handle YYYY-MM-DD format
		if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
			const parsed = new Date(value + "T00:00:00.000Z");
			return isNaN(parsed.getTime()) ? null : parsed;
		}
	}

	return null;
}

// Helper function to check if a column is likely a date column
function isDateColumn(key: string): boolean {
	return (
		key.toLowerCase().includes("date") ||
		key.toLowerCase().includes("created") ||
		key.toLowerCase().includes("updated") ||
		key.toLowerCase().includes("time") ||
		key.toLowerCase().endsWith("at")
	);
}

// Helper function to build where conditions
function buildWhereConditions(table: PgTable, filters: Record<string, any>) {
	const conditions: any[] = [];
	const processedKeys = new Set<string>();

	// Handle date range filters first (e.g., filter_createdAt and filter_createdAt_to)
	for (const [key, value] of Object.entries(filters)) {
		if (value === undefined || value === null) continue;
		if (processedKeys.has(key)) continue;

		// Check for range filters (key ending with _to)
		if (key.endsWith("_to")) {
			const baseKey = key.replace("_to", "");
			const fromValue = filters[baseKey];
			const toValue = value;
			const fromOp = filters[`${baseKey}_op`];
			const toOp = filters[`${key}_op`];

			if (fromValue !== undefined && fromValue !== null) {
				const column = (table as any)[baseKey.replace("filter_", "")];
				if (column) {
					// Parse from value
					let parsedFromValue = fromValue;
					if (
						isDateColumn(baseKey.replace("filter_", "")) ||
						typeof fromValue === "string"
					) {
						const dateValue = parseDate(fromValue);
						if (dateValue) {
							parsedFromValue = dateValue;
						}
					}

					// Parse to value
					let parsedToValue = toValue;
					if (
						isDateColumn(baseKey.replace("filter_", "")) ||
						typeof toValue === "string"
					) {
						const dateValue = parseDate(toValue);
						if (dateValue) {
							parsedToValue = dateValue;
						}
					}

					// Apply from condition
					if (fromOp === "greater_than" || fromOp === "gt") {
						conditions.push(gt(column, parsedFromValue));
					} else {
						conditions.push(gte(column, parsedFromValue));
					}

					// Apply to condition
					if (toOp === "less_than" || toOp === "lt") {
						conditions.push(lt(column, parsedToValue));
					} else {
						conditions.push(lte(column, parsedToValue));
					}

					processedKeys.add(baseKey);
					processedKeys.add(key);
					processedKeys.add(`${baseKey}_op`);
					processedKeys.add(`${key}_op`);
				}
			}
		}
	}

	for (const [key, value] of Object.entries(filters)) {
		if (value === undefined || value === null) continue;
		if (processedKeys.has(key)) continue;

		// Handle operation-based filters
		if (key.endsWith("_op")) {
			const baseKey = key.replace("_op", "");
			const filterValue = filters[baseKey];
			const operation = value;

			if (filterValue !== undefined && filterValue !== null) {
				const column = (table as any)[baseKey.replace("filter_", "")];
				if (column) {
					let parsedValue = filterValue;

					// Try to parse as date for date-like columns or if value looks like a date
					if (
						isDateColumn(baseKey.replace("filter_", "")) ||
						typeof filterValue === "string"
					) {
						const dateValue = parseDate(filterValue);
						if (dateValue) {
							parsedValue = dateValue;
						}
					}

					switch (operation) {
						case "greater_than":
						case "gt":
							conditions.push(gt(column, parsedValue));
							break;
						case "greater_than_or_equal":
						case "gte":
							conditions.push(gte(column, parsedValue));
							break;
						case "less_than":
						case "lt":
							conditions.push(lt(column, parsedValue));
							break;
						case "less_than_or_equal":
						case "lte":
							conditions.push(lte(column, parsedValue));
							break;
						case "equals":
							conditions.push(eq(column, parsedValue));
							break;
						case "contains":
							conditions.push(like(column, `%${parsedValue}%`));
							break;
						case "in":
							if (typeof parsedValue === "string") {
								const values = parsedValue.split(",").map((v) => v.trim());
								conditions.push(or(...values.map((v) => eq(column, v))));
							}
							break;
						default:
							conditions.push(eq(column, parsedValue));
					}
					processedKeys.add(baseKey);
					processedKeys.add(key);
				}
			}
			continue;
		}

		// Skip if this key has an operation or has been processed
		if (filters[`${key}_op`] || processedKeys.has(key)) {
			continue;
		}

		const columnKey = key.replace("filter_", "");
		const column = (table as any)[columnKey];
		if (!column) continue;

		// Default handling for filters without explicit operations
		if (typeof value === "string") {
			// Try to parse as date for date-like columns
			if (isDateColumn(columnKey)) {
				const dateValue = parseDate(value);
				if (dateValue) {
					conditions.push(eq(column, dateValue));
					processedKeys.add(key);
					continue;
				}
			}

			if (value.includes(",")) {
				// Handle multiple values (OR condition)
				const values = value.split(",").map((v) => v.trim());
				conditions.push(or(...values.map((v) => eq(column, v))));
			} else if (
				columnKey.includes("search") ||
				columnKey.includes("name") ||
				columnKey.includes("email")
			) {
				// Text search
				conditions.push(like(column, `%${value}%`));
			} else {
				conditions.push(eq(column, value));
			}
		} else if (typeof value === "number") {
			conditions.push(eq(column, value));
		} else if (value instanceof Date) {
			conditions.push(eq(column, value));
		}
		processedKeys.add(key);
	}

	return conditions.length > 0 ? and(...conditions) : undefined;
}

// Helper function to build order by
function buildOrderBy(table: PgTable, sort?: string, order?: string) {
	if (!sort) {
		const createdAt = (table as any).createdAt;
		return createdAt ? [desc(createdAt)] : [];
	}

	const column = (table as any)[sort];
	if (!column) {
		const createdAt = (table as any).createdAt;
		return createdAt ? [desc(createdAt)] : [];
	}

	return order === "asc" ? [asc(column)] : [desc(column)];
}

// Helper function to build relations query
// Dynamic relation mapping for nested queries
const relationMappings: Record<string, Record<string, string[]>> = {
	users: {
		department: ["manager", "projects"],
		role: ["department"]
	},
	departments: {
		manager: ["role"],
		users: ["role"],
		projects: ["manager"]
	},
	projects: {
		department: ["manager"],
		manager: ["department", "role"]
	},
	roles: {
		department: ["manager"],
		users: ["department"]
	},
	warehouses: {
		manager: ["department", "role"],
		inventory: ["productVariant"],
		transfers: ["items"],
		orders: ["customer", "items"]
	},
	products: {
		category: [],
		supplier: [],
		variants: ["inventory"]
	},
	productVariants: {
		product: ["category", "supplier"],
		inventory: ["warehouse"]
	},
	inventory: {
		productVariant: ["product"],
		warehouse: ["manager"],
		movements: ["user"]
	},
	inventoryMovements: {
		inventory: ["productVariant", "warehouse"],
		user: ["department", "role"]
	},
	transfers: {
		fromWarehouse: ["manager"],
		toWarehouse: ["manager"],
		items: ["productVariant"],
		requestedBy: ["department", "role"],
		approvedBy: ["department", "role"]
	},
	transferItems: {
		transfer: ["fromWarehouse", "toWarehouse"],
		productVariant: ["product"]
	},
	customers: {
		addresses: [],
		orders: ["warehouse", "items"]
	},
	customerAddresses: {
		customer: ["orders"]
	},
	carriers: {
		shipments: ["order", "warehouse"]
	},
	orders: {
		customer: ["addresses"],
		warehouse: ["manager"],
		items: ["productVariant"],
		shipments: ["carrier"]
	},
	orderItems: {
		order: ["customer", "warehouse"],
		productVariant: ["product"]
	},
	shipments: {
		order: ["customer", "items"],
		carrier: [],
		warehouse: ["manager"]
	}
};

function buildRelationsQuery(
	modelName: string,
	populate?: string,
	depth: number = 1,
) {
	if (!populate || depth <= 0) return {};

	const relations: Record<string, any> = {};
	const populateFields = populate.split(",").map((field) => field.trim());
	const modelConfig = modelRegistry[modelName];
	
	if (!modelConfig || !modelConfig.relations) {
		return {};
	}

	// Use model-specific relation mappings if available, otherwise use global mappings
	const currentRelationMappings = modelConfig.relationMappings || relationMappings[modelName] || {};

	for (const field of populateFields) {
		// Check if the field is a valid relation for this model
		if (modelConfig.relations.includes(field)) {
			if (depth > 1) {
				// Get nested relations for this field from the mapping
				const nestedRelations = currentRelationMappings[field] || [];
				
				if (nestedRelations.length > 0) {
					const withClause: Record<string, any> = {};
					
					for (const nestedField of nestedRelations) {
						// Recursively build nested relations for deeper levels
						if (depth > 2) {
							// Try to get the target model for this nested field
							const targetModelName = getTargetModelName(field, nestedField);
							if (targetModelName && relationMappings[targetModelName]?.[nestedField]) {
								const deeperRelations = relationMappings[targetModelName][nestedField];
								if (deeperRelations.length > 0) {
									const deepWithClause: Record<string, any> = {};
									for (const deepField of deeperRelations) {
										deepWithClause[deepField] = true;
									}
									withClause[nestedField] = { with: deepWithClause };
								} else {
									withClause[nestedField] = true;
								}
							} else {
								withClause[nestedField] = true;
							}
						} else {
							withClause[nestedField] = true;
						}
					}
					
					relations[field] = { with: withClause };
				} else {
					relations[field] = true;
				}
			} else {
				relations[field] = true;
			}
		}
	}

	return Object.keys(relations).length > 0 ? { with: relations } : {};
}

// Helper function to determine target model name for nested relations
function getTargetModelName(parentField: string, nestedField: string): string | null {
	// Simple mapping for common relation patterns
	const fieldToModelMap: Record<string, string> = {
		manager: "users",
		user: "users",
		users: "users",
		department: "departments",
		role: "roles",
		warehouse: "warehouses",
		product: "products",
		productVariant: "productVariants",
		category: "productCategories",
		supplier: "suppliers",
		customer: "customers",
		carrier: "carriers",
		order: "orders",
		transfer: "transfers",
		inventory: "inventory",
		shipment: "shipments"
	};
	
	return fieldToModelMap[parentField] || null;
}

// Map lowercase model names to drizzle query keys
const modelToQueryMap: Record<string, string> = {
	user: "user",
	departments: "departments",
	roles: "roles",
	projects: "projects",
	warehouses: "warehouses",
	productcategories: "productCategories",
	"product-categories": "productCategories",
	suppliers: "suppliers",
	products: "products",
	productvariant: "productVariants",
	productvariants: "productVariants",
	"product-variants": "productVariants",
	inventory: "inventory",
	inventorymovements: "inventoryMovements",
	"inventory-movements": "inventoryMovements",
	transfers: "transfers",
	transferitems: "transferItems",
	"transfer-items": "transferItems",
	customers: "customers",
	customeraddresses: "customerAddresses",
	"customer-addresses": "customerAddresses",
	carriers: "carriers",
	orders: "orders",
	orderitems: "orderItems",
	"order-items": "orderItems",
	shipments: "shipments"
};

// Generic API handler
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
				const depth = parseInt(searchParams.get("depth") || "1");

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
							"depth",
							"search",
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

				const offset = (page - 1) * limit;
				const whereConditions = buildWhereConditions(config.table, filters);
				const orderBy = buildOrderBy(config.table, sort, order);
				// @ts-expect-error  - drizzle-orm types are not up-to-date
				const relations = buildRelationsQuery(modelName, populate, depth);

				// Get total count
				const totalResult = await db
					.select({ count: count() })
					.from(config.table)
					.where(whereConditions);
				const total = totalResult[0]?.count || 0;

				// Get data with relations
				const queryConfig = {
					where: whereConditions,
					limit,
					offset,
					orderBy: orderBy.length > 0 ? orderBy : undefined,
					...relations,
				};
				// @ts-expect-error  - drizzle-orm types are not up-to-date
				const data = await db.query[queryKey].findMany(queryConfig);

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
				const validatedData = config.createSchema.parse(body);

				const result = await db
					.insert(config.table)
					.values(validatedData)
					.returning();

				return NextResponse.json(
					{
						success: true,
						data: result[0],
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
				const depth = parseInt(searchParams.get("depth") || "1");
				// @ts-expect-error  - drizzle-orm types are not up-to-date
				const relations = buildRelationsQuery(modelName, populate, depth);

				// biome-ignore lint/suspicious/noImplicitAnyLet: its okay
				let result;
				if (Object.keys(relations).length > 0) {
					// Use query API for relations
					// @ts-expect-error  - drizzle-orm types are not up-to-date
					result = await db.query[queryKey].findFirst({
						where: eq((config.table as any).id, id),
						...relations,
					});
				} else {
					// Use regular select for simple queries
					const queryResult = await db
						.select()
						.from(config.table)
						.where(eq((config.table as any).id, id))
						.limit(1);
					result = queryResult[0];
				}

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

				const result = await db
					.update(config.table)
					.set(updateData)
					.where(eq((config.table as any).id, id))
					.returning();

				if (result.length === 0) {
					return NextResponse.json(
						{ success: false, error: `${modelName} not found` },
						{ status: 404 },
					);
				}

				return NextResponse.json({
					success: true,
					data: result[0],
				});
			} catch (error) {
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
				return NextResponse.json(
					{ success: false, error: "Internal server error" },
					{ status: 500 },
				);
			}
		},

		// DELETE /api/[model]/[id] - Delete record
		async DELETE(_request: NextRequest, id: string) {
			try {
				const result = await db
					.delete(config.table)
					.where(eq((config.table as any).id, id))
					.returning();

				if (result.length === 0) {
					return NextResponse.json(
						{ success: false, error: `${modelName} not found` },
						{ status: 404 },
					);
				}

				return NextResponse.json({
					success: true,
					message: `${modelName} deleted successfully`,
				});
			} catch (error) {
				console.error(`Error deleting ${modelName}:`, error);
				return NextResponse.json(
					{ success: false, error: "Internal server error" },
					{ status: 500 },
				);
			}
		},
	};
}

// Utility functions for handling populate depth in API routes

// Define model relations mapping based on Prisma schema
export const modelRelations: Record<string, string[]> = {
	user: [
		'role',
		'department',
		'managedDepartments',
		'managedProjects',
		'Warehouse',
		'sessions',
		'accounts',
	],
	session: ['user'],
	account: ['user'],
	verification: [],
	department: ['manager', 'users', 'projects', 'roles'],
	role: ['department', 'users'],
	project: ['department', 'manager'],
	warehouse: [
		'manager',
		'inventory',
		'inventoryMovements',
		'transfersFrom',
		'transfersTo',
	],
	productcategory: ['parent', 'children', 'products'],
	supplier: ['products'],
	product: ['category', 'supplier', 'productVariants'],
	productvariant: [
		'product',
		'inventory',
		'inventoryMovements',
		'transferItems',
		'orderItems',
	],
	inventory: ['warehouse', 'productVariant'],
	inventorymovement: ['warehouse', 'productVariant'],
	transfer: ['fromWarehouse', 'toWarehouse', 'transferItems'],
	transferitem: ['transfer', 'productVariant'],
	customer: ['addresses', 'orders'],
	customeraddress: ['customer'],
	carrier: ['shipments'],
	order: ['customer', 'orderItems', 'shipments'],
	orderitem: ['order', 'productVariant'],
	shipment: ['order', 'carrier'],
};

// Configuration for depth limits
export const DEPTH_LIMITS = {
	MAX_SPECIFIC_DEPTH: 5, // Maximum depth when specific fields are populated
	MAX_ALL_RELATIONS_DEPTH: 3, // Maximum depth when all relations are populated
	DEFAULT_DEPTH: 1, // Default depth if not specified
} as const;

/**
 * Builds a nested include object for Prisma queries based on relations and depth
 * @param relations - Array of relation field names to include
 * @param depth - Maximum depth to traverse
 * @param currentDepth - Current traversal depth (internal use)
 * @returns Prisma include object
 */
export function buildIncludeObject(
	relations: string[],
	depth: number,
	currentDepth: number = 1
): Record<string, any> {
	if (currentDepth > depth || depth <= 0) {
		return {};
	}

	const include: Record<string, any> = {};

	relations.forEach((relation) => {
		if (currentDepth === depth) {
			// At max depth, just include the relation without nesting
			include[relation] = true;
		} else {
			// For deeper levels, recursively build nested includes
			const nestedRelations = modelRelations[relation] || [];
			if (nestedRelations.length > 0) {
				include[relation] = {
					include: buildIncludeObject(
						nestedRelations,
						depth,
						currentDepth + 1
					),
				};
			} else {
				include[relation] = true;
			}
		}
	});

	return include;
}

/**
 * Validates and filters populate fields against valid model relations
 * @param modelName - Name of the model
 * @param populateFields - Array of field names to populate
 * @returns Filtered array of valid relation fields
 */
export function validatePopulateFields(
	modelName: string,
	populateFields: string[]
): string[] {
	const validRelations = modelRelations[modelName] || [];
	return populateFields.filter((field) => validRelations.includes(field));
}

/**
 * Builds the complete include object for a Prisma query
 * @param modelName - Name of the model
 * @param populate - Array of fields to populate (empty for all relations)
 * @param depth - Depth to traverse (defaults to 1)
 * @returns Prisma include object or empty object
 */
export function buildPopulateInclude(
	modelName: string,
	populate: string[] = [],
	depth: number = DEPTH_LIMITS.DEFAULT_DEPTH
): Record<string, any> {
	let include: Record<string, any> = {};

	if (populate.length > 0) {
		// Validate populate fields against model relations
		const validPopulateFields = validatePopulateFields(modelName, populate);

		if (validPopulateFields.length > 0) {
			const limitedDepth = Math.max(
				1,
				Math.min(depth, DEPTH_LIMITS.MAX_SPECIFIC_DEPTH)
			);
			include = buildIncludeObject(validPopulateFields, limitedDepth);
		}
	} else if (depth > 1) {
		// If no specific populate fields but depth > 1, include all relations up to specified depth
		const allRelations = modelRelations[modelName] || [];
		if (allRelations.length > 0) {
			const limitedDepth = Math.max(
				1,
				Math.min(depth, DEPTH_LIMITS.MAX_ALL_RELATIONS_DEPTH)
			);
			include = buildIncludeObject(allRelations, limitedDepth);
		}
	}

	return include;
}

/**
 * Parses populate and depth parameters from URL search params
 * @param searchParams - URLSearchParams object
 * @returns Object with parsed populate array and depth number
 */
export function parsePopulateParams(searchParams: URLSearchParams) {
	const populateParam = searchParams.get('populate');
	const depthParam = searchParams.get('depth');

	const populate =
		populateParam
			?.split(',')
			.map((field) => field.trim())
			.filter(Boolean) || [];
	const depth = depthParam
		? parseInt(depthParam, 10)
		: DEPTH_LIMITS.DEFAULT_DEPTH;

	return { populate, depth };
}

/**
 * Gets all valid relations for a given model
 * @param modelName - Name of the model
 * @returns Array of valid relation field names
 */
export function getModelRelations(modelName: string): string[] {
	return modelRelations[modelName] || [];
}

/**
 * Checks if a field is a valid relation for a given model
 * @param modelName - Name of the model
 * @param fieldName - Name of the field to check
 * @returns Boolean indicating if the field is a valid relation
 */
export function isValidRelation(modelName: string, fieldName: string): boolean {
	const validRelations = modelRelations[modelName] || [];
	return validRelations.includes(fieldName);
}

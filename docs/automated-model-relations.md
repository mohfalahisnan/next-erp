# Automated Model Relations System

This document explains the automated system for generating and maintaining model relations in the ERP API's populate depth feature.

## Overview

The `modelRelations` mapping in `src/lib/populate-utils.ts` is now automatically generated from the Prisma schema file, eliminating the need for manual maintenance and ensuring consistency between the database schema and API population capabilities.

## How It Works

### 1. Automatic Generation

The system uses a Node.js script (`scripts/generate-model-relations.js`) that:

- **Parses the Prisma schema** (`prisma/schema.prisma`)
- **Extracts model relationships** by analyzing:
    - `@relation` annotations
    - Array field types (one-to-many relationships)
    - Referenced model types (foreign key relationships)
- **Generates the `modelRelations` object** with proper TypeScript typing
- **Updates `populate-utils.ts`** automatically

### 2. Schema Analysis

The script identifies relationships by looking for:

```prisma
// Direct relations with @relation annotation
role Role? @relation(fields: [roleId], references: [id])

// Array relations (one-to-many)
managedDepartments Department[] @relation("DepartmentManager")

// Simple model references
user User
```

### 3. Generated Output

The script generates a complete `modelRelations` mapping:

```typescript
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
```

## Usage

### Manual Generation

Run the generation script manually:

```bash
npm run generate:relations
```

### Automatic Generation

The relations are automatically regenerated:

- **After `npm install`** (via `postinstall` script)
- **After Prisma schema changes** (recommended to run manually)

### Development Workflow

1. **Modify Prisma schema** (`prisma/schema.prisma`)
2. **Run migration** (`npm run db:migrate`)
3. **Regenerate relations** (`npm run generate:relations`)
4. **Test API endpoints** with new populate options

## Benefits

### 1. **Consistency**

- Relations always match the actual database schema
- No risk of outdated or incorrect relation mappings
- Automatic synchronization with schema changes

### 2. **Maintainability**

- No manual updates required when adding/removing relations
- Reduces human error in relation definitions
- Single source of truth (Prisma schema)

### 3. **Developer Experience**

- Automatic discovery of new relations
- Immediate availability of new populate options
- Clear audit trail of relation changes

### 4. **Type Safety**

- Generated relations are properly typed
- Compile-time validation of relation usage
- IntelliSense support for relation names

## Script Details

### File: `scripts/generate-model-relations.js`

#### Key Functions:

- **`parseModelRelations()`**: Parses Prisma schema and extracts relations
- **`generateModelRelationsString()`**: Formats relations as TypeScript code
- **`updatePopulateUtils()`**: Updates the populate-utils.ts file

#### Parsing Logic:

1. **Model Detection**: Identifies `model ModelName {` blocks
2. **Relation Extraction**: Finds relation fields using multiple patterns:
    - Lines with `@relation` annotations
    - Array fields (`FieldName[]`)
    - Model type references
3. **Filtering**: Excludes primitive types and enums
4. **Normalization**: Converts model names to lowercase for consistency

## Examples

### Before (Manual)

```typescript
// Manual maintenance required
export const modelRelations: Record<string, string[]> = {
	user: ['role', 'department'], // Missing: managedDepartments, managedProjects, etc.
	// ... other models (potentially outdated)
};
```

### After (Automated)

```typescript
// Automatically generated and always up-to-date
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
	// ... all models with complete relations
};
```

### API Usage Remains the Same

```bash
# All these work automatically with new relations
GET /api/user?populate=role,department,managedDepartments&depth=2
GET /api/product?populate=category,supplier,productVariants&depth=3
GET /api/warehouse?depth=2  # Includes all discovered relations
```

## Error Handling

The generation script includes robust error handling:

- **Schema file validation**: Ensures Prisma schema exists and is readable
- **Parsing errors**: Graceful handling of malformed schema syntax
- **File update errors**: Validates successful file updates
- **Backup preservation**: Maintains original file if update fails

## Integration with CI/CD

### Recommended Workflow

```yaml
# .github/workflows/ci.yml
steps:
    - name: Install dependencies
      run: npm install

    - name: Generate Prisma client
      run: npm run db:generate

    - name: Generate model relations
      run: npm run generate:relations

    - name: Run tests
      run: npm test
```

### Pre-commit Hook

```bash
# .husky/pre-commit
npm run generate:relations
git add src/lib/populate-utils.ts
```

## Troubleshooting

### Common Issues

1. **Missing Relations**
    - Ensure Prisma schema has proper `@relation` annotations
    - Check that field names match model names
    - Verify model names are properly capitalized

2. **Generation Fails**
    - Check Prisma schema syntax
    - Ensure file permissions allow writing to `populate-utils.ts`
    - Verify Node.js can read the schema file

3. **Outdated Relations**
    - Run `npm run generate:relations` after schema changes
    - Check that the script completed successfully
    - Verify the updated file was saved

### Debug Mode

Add debug logging to the generation script:

```javascript
// In generate-model-relations.js
console.log('Debug: Current model:', currentModel);
console.log('Debug: Found relation:', fieldName);
```

## Future Enhancements

### Planned Features

1. **Relation Metadata**: Include relation types (one-to-one, one-to-many, many-to-many)
2. **Custom Annotations**: Support for custom populate behavior via schema comments
3. **Validation**: Ensure all relations are valid and accessible
4. **Performance Hints**: Suggest optimal populate strategies based on schema

### Integration Opportunities

- **GraphQL Schema Generation**: Use relations for automatic GraphQL resolvers
- **API Documentation**: Generate populate examples from relations
- **Type Generation**: Create TypeScript types for populated responses

## Conclusion

The automated model relations system provides a robust, maintainable solution for keeping API populate capabilities synchronized with the database schema. By eliminating manual maintenance, it reduces errors and improves developer productivity while ensuring the API always reflects the current data model.

For questions or issues, refer to the troubleshooting section or check the script logs for detailed error information.

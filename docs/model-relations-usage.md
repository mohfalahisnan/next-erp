# Model Relations Usage Guide

This guide explains how to use the automated model relations system for API populate functionality.

## Quick Start

### 1. Generate Relations

After modifying your Prisma schema, regenerate the model relations:

```bash
npm run generate:relations
```

### 2. Use in API Calls

The relations are automatically available in your API endpoints:

```bash
# Basic population
GET /api/user?populate=role,department

# With depth control
GET /api/user?populate=role&depth=2

# All relations with depth
GET /api/product?depth=2
```

## Available Relations

Here are the currently available relations for each model:

### User Relations

```
user: ['role', 'department', 'managedDepartments', 'managedProjects', 'Warehouse', 'sessions', 'accounts']
```

**Examples:**

```bash
# Get user with role and department
GET /api/user?populate=role,department

# Get user with managed departments (depth 2 to see department details)
GET /api/user?populate=managedDepartments&depth=2

# Get user with all relations
GET /api/user?depth=2
```

### Product Relations

```
product: ['category', 'supplier', 'productVariants']
productvariant: ['product', 'inventory', 'inventoryMovements', 'transferItems', 'orderItems']
productcategory: ['parent', 'children', 'products']
```

**Examples:**

```bash
# Product catalog with categories and suppliers
GET /api/product?populate=category,supplier,productVariants&depth=2

# Product variants with inventory
GET /api/productvariant?populate=inventory,product&depth=2

# Category hierarchy
GET /api/productcategory?populate=parent,children&depth=3
```

### Warehouse Relations

```
warehouse: ['manager', 'inventory', 'inventoryMovements', 'transfersFrom', 'transfersTo']
inventory: ['warehouse', 'productVariant']
inventorymovement: ['warehouse', 'productVariant']
```

**Examples:**

```bash
# Warehouse overview
GET /api/warehouse?populate=manager,inventory&depth=2

# Inventory with product details
GET /api/inventory?populate=warehouse,productVariant&depth=2

# Inventory movements
GET /api/inventorymovement?populate=warehouse,productVariant&depth=1
```

### Order Relations

```
order: ['customer', 'orderItems', 'shipments']
orderitem: ['order', 'productVariant']
customer: ['addresses', 'orders']
```

**Examples:**

```bash
# Order details
GET /api/order?populate=customer,orderItems,shipments&depth=2

# Customer with order history
GET /api/customer?populate=orders,addresses&depth=2

# Order items with product details
GET /api/orderitem?populate=order,productVariant&depth=2
```

### Department & Role Relations

```
department: ['manager', 'users', 'projects', 'roles']
role: ['department', 'users']
project: ['department', 'manager']
```

**Examples:**

```bash
# Department overview
GET /api/department?populate=manager,users,projects&depth=2

# Role with users and department
GET /api/role?populate=department,users&depth=2

# Project details
GET /api/project?populate=department,manager&depth=2
```

## Advanced Usage

### Selective Population

Choose only the relations you need for better performance:

```bash
# Good: Specific relations
GET /api/user?populate=role,department&depth=1

# Less optimal: All relations
GET /api/user?depth=3
```

### Nested Relations

Use depth to control how deep the nesting goes:

```bash
# Depth 1: Direct relations only
GET /api/user?populate=role&depth=1
# Returns: user.role (basic role info)

# Depth 2: Relations of relations
GET /api/user?populate=role&depth=2
# Returns: user.role.department, user.role.users, etc.

# Depth 3: Even deeper nesting
GET /api/user?populate=role&depth=3
# Returns: user.role.department.manager, user.role.department.projects, etc.
```

### Complex Queries

Combine multiple relations with appropriate depth:

```bash
# E-commerce product page
GET /api/product?populate=category,supplier,productVariants&depth=2

# User dashboard
GET /api/user?populate=role,department,managedProjects&depth=2

# Warehouse management
GET /api/warehouse?populate=inventory,transfersFrom,transfersTo&depth=2

# Order fulfillment
GET /api/order?populate=orderItems,customer,shipments&depth=2
```

## Performance Tips

### 1. Be Specific

```bash
# ✅ Good: Only what you need
GET /api/user?populate=role,department&depth=1

# ❌ Avoid: Everything at high depth
GET /api/user?depth=5
```

### 2. Use Appropriate Depth

```bash
# ✅ Good: Reasonable depth
GET /api/product?populate=category&depth=2

# ❌ Avoid: Excessive depth
GET /api/product?populate=category&depth=5
```

### 3. Consider Pagination

```bash
# ✅ Good: Paginated with relations
GET /api/user?populate=role&depth=1&page=1&limit=20

# ❌ Avoid: All records with deep nesting
GET /api/user?depth=3&limit=1000
```

## Validation

The system automatically validates relations:

- **Invalid relations are ignored**: `?populate=role,invalidField` → only `role` is populated
- **Invalid models return errors**: `/api/invalidmodel` → 404 error
- **Depth limits are enforced**: Maximum depth of 5 for specific fields, 3 for all relations

## Troubleshooting

### Relations Not Working

1. **Check if relations exist**:

    ```bash
    # Test with a simple relation first
    GET /api/user?populate=role
    ```

2. **Verify model name**:

    ```bash
    # Use lowercase model names
    GET /api/user  # ✅ Correct
    GET /api/User  # ❌ Wrong
    ```

3. **Check relation names**:
    ```bash
    # Use exact field names from schema
    GET /api/user?populate=role          # ✅ Correct
    GET /api/user?populate=userRole      # ❌ Wrong
    ```

### Performance Issues

1. **Reduce depth**:

    ```bash
    # Instead of depth=3
    GET /api/user?populate=role&depth=1
    ```

2. **Be more specific**:

    ```bash
    # Instead of all relations
    GET /api/user?populate=role,department&depth=1
    ```

3. **Use pagination**:
    ```bash
    GET /api/user?populate=role&page=1&limit=10
    ```

### Missing Relations

1. **Regenerate relations**:

    ```bash
    npm run generate:relations
    ```

2. **Check Prisma schema**:
    - Ensure `@relation` annotations are present
    - Verify field names match model names
    - Check that relations are properly defined

3. **Restart development server**:
    ```bash
    npm run dev
    ```

## Integration Examples

### React/Next.js

```typescript
// hooks/useUserWithRelations.ts
export const useUserWithRelations = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId, 'relations'],
    queryFn: () =>
      fetch(`/api/user/${userId}?populate=role,department,managedProjects&depth=2`)
        .then(res => res.json())
  });
};

// components/UserProfile.tsx
const UserProfile = ({ userId }: { userId: string }) => {
  const { data: user } = useUserWithRelations(userId);

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>Role: {user?.role?.name}</p>
      <p>Department: {user?.department?.name}</p>
      <h2>Managed Projects:</h2>
      {user?.managedProjects?.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
};
```

### API Client

```typescript
// lib/api-client.ts
class ApiClient {
	async getWithRelations<T>(
		model: string,
		id?: string,
		populate?: string[],
		depth?: number
	): Promise<T> {
		const params = new URLSearchParams();
		if (populate?.length) params.set('populate', populate.join(','));
		if (depth) params.set('depth', depth.toString());

		const url = id
			? `/api/${model}/${id}?${params}`
			: `/api/${model}?${params}`;

		const response = await fetch(url);
		return response.json();
	}
}

// Usage
const client = new ApiClient();
const user = await client.getWithRelations(
	'user',
	'123',
	['role', 'department'],
	2
);
const products = await client.getWithRelations(
	'product',
	undefined,
	['category', 'supplier'],
	1
);
```

## Best Practices

1. **Start Simple**: Begin with depth=1 and specific relations
2. **Monitor Performance**: Use browser dev tools to check response times
3. **Cache Responses**: Implement caching for frequently accessed nested data
4. **Use TypeScript**: Define interfaces for your populated responses
5. **Document Usage**: Keep track of which relations your frontend actually uses
6. **Regular Updates**: Run `npm run generate:relations` after schema changes

For more detailed information, see the [Automated Model Relations Documentation](./automated-model-relations.md).

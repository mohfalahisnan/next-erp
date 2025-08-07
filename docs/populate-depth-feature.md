# Populate Depth Feature

This document explains how to use the populate depth feature in the ERP API to control nested data fetching.

## Overview

The populate depth feature allows you to:
- Specify which related data to include in API responses
- Control how deep the nesting should go
- Optimize performance by limiting unnecessary data fetching
- Validate relation fields to prevent invalid requests

## URL Parameters

### `populate`
Comma-separated list of relation fields to include in the response.

**Example:**
```
GET /api/user?populate=role,department
```

### `depth`
Integer specifying how many levels deep to traverse relations (default: 1, max: 5 for specific fields, max: 3 for all relations).

**Example:**
```
GET /api/user?populate=role,department&depth=2
```

## API Endpoints

### Get All Records
```
GET /api/{model}
GET /api/{model}?populate=relation1,relation2
GET /api/{model}?populate=relation1&depth=2
```

### Get Single Record by ID
```
GET /api/{model}/{id}
GET /api/{model}/{id}?populate=relation1,relation2
GET /api/{model}/{id}?populate=relation1&depth=2
```

## Usage Examples

### Basic Population
Fetch all users with their roles:
```
GET /api/user?populate=role
```

Fetch a specific user with their role:
```
GET /api/user/user123?populate=role
```

Response includes:
```json
{
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": {
      "id": "role1",
      "name": "Manager",
      "description": "Department Manager"
      }
    }
  ]
}
```

### Multiple Relations
Fetch users with roles and departments:
```
GET /api/user?populate=role,department
```

### Nested Population with Depth
Fetch users with roles and their departments (2 levels deep):
```
GET /api/user?populate=role&depth=2
```

Response includes:
```json
{
  "data": [
    {
      "id": "user1",
      "name": "John Doe",
      "role": {
        "id": "role1",
        "name": "Manager",
        "department": {
          "id": "dept1",
          "name": "Engineering",
          "description": "Software Engineering Department"
        }
      }
    }
  ]
}
```

### Deep Nesting
Fetch departments with all nested relations (3 levels deep):
```
GET /api/department?depth=3
```

This will include:
- Department → Manager → Role → Department (circular reference handled)
- Department → Users → Roles → Department
- Department → Projects → Manager → Department

## Model Relations

Here are the available relations for each model:

### User
- `role` - User's role
- `department` - User's department
- `managedDepartments` - Departments managed by this user
- `managedProjects` - Projects managed by this user
- `Warehouse` - Warehouses managed by this user
- `sessions` - User's active sessions
- `accounts` - User's linked accounts

### Department
- `manager` - Department manager
- `users` - Users in this department
- `projects` - Projects belonging to this department
- `roles` - Roles in this department

### Role
- `department` - Role's department
- `users` - Users with this role

### Project
- `department` - Project's department
- `manager` - Project manager

### Product
- `category` - Product category
- `supplier` - Product supplier
- `productVariants` - Product variants

### Warehouse
- `manager` - Warehouse manager
- `inventory` - Inventory items
- `inventoryMovements` - Inventory movements
- `transfersFrom` - Outgoing transfers
- `transfersTo` - Incoming transfers

## Performance Considerations

### Depth Limits
- **Specific fields**: Maximum depth of 5 levels
- **All relations**: Maximum depth of 3 levels (more conservative)
- **Default depth**: 1 level if not specified

### Best Practices
1. **Be specific**: Only populate the fields you need
2. **Limit depth**: Use the minimum depth required for your use case
3. **Avoid circular references**: The system handles them, but they can impact performance
4. **Monitor response size**: Deep nesting can result in large responses

### Example of Efficient vs Inefficient Queries

**Efficient** (specific fields, limited depth):
```
GET /api/user?populate=role,department&depth=1
```

**Less Efficient** (all relations, deep nesting):
```
GET /api/user?depth=5
```

## Error Handling

### Invalid Model
```json
{
  "error": {
    "message": "Invalid model name",
    "details": "Invalid Model Name",
    "code": "NOT_FOUND"
  }
}
```

### Invalid Relations
Invalid relation fields are automatically filtered out. Only valid relations for the specified model will be included.

## Implementation Details

### Validation
- All populate fields are validated against the model's available relations
- Invalid fields are silently filtered out
- Depth is clamped to safe limits

### Recursive Building
The system recursively builds Prisma include objects:
```typescript
// Example generated include object for depth=2
{
  role: {
    include: {
      department: true,
      users: true
    }
  },
  department: {
    include: {
      manager: true,
      users: true,
      projects: true,
      roles: true
    }
  }
}
```

### Circular Reference Handling
The system prevents infinite loops by:
- Limiting maximum depth
- Stopping recursion at the specified depth limit
- Using Prisma's built-in circular reference handling

## Advanced Usage

### Conditional Population
You can combine populate with other query parameters:
```
GET /api/user?populate=role,department&depth=2&status=Active
```

### Complex Nested Queries
For complex scenarios, you might want to fetch specific nested data:
```
GET /api/department?populate=manager,projects&depth=2
```

This fetches:
- Department
  - Manager (with their role and department)
  - Projects (with their department and manager)

## Migration from Simple Population

If you were previously using simple population:

**Before:**
```
GET /api/user?populate=role,department
```

**After (same result):**
```
GET /api/user?populate=role,department&depth=1
```

**Enhanced (with nesting):**
```
GET /api/user?populate=role,department&depth=2
```

The new system is backward compatible - existing queries will work the same way.
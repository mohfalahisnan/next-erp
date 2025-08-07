# Populate Depth API Examples

This file contains practical examples of using the populate depth feature in the ERP API.

## API Endpoint Types

### Get All Records
Fetch multiple records from a model:
```bash
GET /api/{model}
GET /api/{model}?populate=relation1,relation2
GET /api/{model}?populate=relation1&depth=2
```

### Get Single Record by ID
Fetch a specific record by its ID:
```bash
GET /api/{model}/{id}
GET /api/{model}/{id}?populate=relation1,relation2
GET /api/{model}/{id}?populate=relation1&depth=2
```

## Basic Examples

### 1. Fetch All Users with Their Roles
```bash
curl "http://localhost:3000/api/user?populate=role"
```

**Response:**
```json
{
  "data": [
    {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@company.com",
      "role": {
        "id": "role_456",
        "name": "Manager",
        "description": "Department Manager"
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "message": "Success"
  }
}
```

### 1b. Fetch Single User by ID with Role
```bash
curl "http://localhost:3000/api/user/user_123?populate=role"
```

**Response:**
```json
{
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@company.com",
    "role": {
      "id": "role_456",
      "name": "Manager",
      "description": "Department Manager"
    }
  },
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "message": "Success"
  }
}
```

### 2. Fetch Departments with Managers
```bash
curl "http://localhost:3000/api/department?populate=manager"
```

**Response:**
```json
{
  "data": [
    {
      "id": "dept_789",
      "name": "Engineering",
      "description": "Software Engineering Department",
      "manager": {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@company.com"
      }
    }
  ]
}
```

## Depth Examples

### 3. Nested Relations (Depth 2)
```bash
curl "http://localhost:3000/api/user?populate=role&depth=2"
```

**Response:**
```json
{
  "data": [
    {
      "id": "user_123",
      "name": "John Doe",
      "role": {
        "id": "role_456",
        "name": "Manager",
        "department": {
          "id": "dept_789",
          "name": "Engineering",
          "description": "Software Engineering Department"
        },
        "users": [
          {
            "id": "user_124",
            "name": "Jane Smith"
          }
        ]
      }
    }
  ]
}
```

### 4. Deep Nesting (Depth 3)
```bash
curl "http://localhost:3000/api/department?populate=manager&depth=3"
```

**Response:**
```json
{
  "data": [
    {
      "id": "dept_789",
      "name": "Engineering",
      "manager": {
        "id": "user_123",
        "name": "John Doe",
        "role": {
          "id": "role_456",
          "name": "Manager",
          "department": {
            "id": "dept_789",
            "name": "Engineering"
          }
        },
        "department": {
          "id": "dept_789",
          "name": "Engineering",
          "users": [
            {
              "id": "user_124",
              "name": "Jane Smith"
            }
          ]
        }
      }
    }
  ]
}
```

## Complex Scenarios

### 5. Multiple Relations with Depth
```bash
curl "http://localhost:3000/api/user?populate=role,department,managedProjects&depth=2"
```

### 6. Product with Category and Supplier
```bash
curl "http://localhost:3000/api/product?populate=category,supplier,productVariants&depth=2"
```

**Response:**
```json
{
  "data": [
    {
      "id": "prod_001",
      "sku": "LAPTOP-001",
      "name": "Business Laptop",
      "category": {
        "id": "cat_electronics",
        "name": "Electronics",
        "parent": {
          "id": "cat_tech",
          "name": "Technology"
        },
        "products": [
          {
            "id": "prod_002",
            "name": "Gaming Laptop"
          }
        ]
      },
      "supplier": {
        "id": "sup_001",
        "name": "Tech Supplier Inc",
        "products": [
          {
            "id": "prod_001",
            "name": "Business Laptop"
          }
        ]
      },
      "productVariants": [
        {
          "id": "var_001",
          "sku": "LAPTOP-001-16GB",
          "name": "16GB RAM Variant",
          "inventory": [
            {
              "id": "inv_001",
              "quantity": 50
            }
          ]
        }
      ]
    }
  ]
}
```

### 7. Warehouse with All Relations
```bash
curl "http://localhost:3000/api/warehouse?depth=2"
```

**Response:**
```json
{
  "data": [
    {
      "id": "wh_001",
      "name": "Main Warehouse",
      "location": "New York",
      "manager": {
        "id": "user_125",
        "name": "Bob Wilson",
        "role": {
          "id": "role_warehouse",
          "name": "Warehouse Manager"
        }
      },
      "inventory": [
        {
          "id": "inv_001",
          "quantity": 50,
          "productVariant": {
            "id": "var_001",
            "name": "16GB RAM Variant"
          }
        }
      ],
      "inventoryMovements": [
        {
          "id": "mov_001",
          "type": "IN",
          "quantity": 10,
          "productVariant": {
            "id": "var_001",
            "name": "16GB RAM Variant"
          }
        }
      ]
    }
  ]
}
```

## Performance Optimization Examples

### 8. Efficient Query (Specific Fields)
```bash
# Good: Only fetch what you need
curl "http://localhost:3000/api/user?populate=role,department&depth=1"
```

### 9. Less Efficient Query (All Relations)
```bash
# Less optimal: Fetches all relations
curl "http://localhost:3000/api/user?depth=3"
```

## Error Handling Examples

### 10. Invalid Model
```bash
curl "http://localhost:3000/api/invalidmodel?populate=role"
```

**Response:**
```json
{
  "error": {
    "message": "Invalid model name",
    "details": "Invalid Model Name",
    "code": "NOT_FOUND"
  }
}
```

### 11. Invalid Relations (Filtered Out)
```bash
curl "http://localhost:3000/api/user?populate=role,invalidfield,department"
```

**Result:** Only `role` and `department` will be populated; `invalidfield` is ignored.

## Frontend Integration Examples

### 12. React/JavaScript Usage
```javascript
// Fetch users with roles and departments
const fetchUsersWithRelations = async () => {
  const response = await fetch('/api/user?populate=role,department&depth=2');
  const data = await response.json();
  return data;
};

// Fetch specific user with deep nesting
const fetchUserDetails = async (userId) => {
  const response = await fetch(`/api/user/${userId}?populate=role,managedProjects,managedDepartments&depth=3`);
  const data = await response.json();
  return data;
};

// Fetch products for catalog
const fetchProductCatalog = async () => {
  const response = await fetch('/api/product?populate=category,supplier,productVariants&depth=2');
  const data = await response.json();
  return data;
};
```

### 13. TypeScript Usage
```typescript
interface UserWithRelations {
  id: string;
  name: string;
  email: string;
  role?: {
    id: string;
    name: string;
    department?: {
      id: string;
      name: string;
    };
  };
  department?: {
    id: string;
    name: string;
    manager?: {
      id: string;
      name: string;
    };
  };
}

const fetchUsers = async (): Promise<UserWithRelations[]> => {
  const response = await fetch('/api/user?populate=role,department&depth=2');
  const result = await response.json();
  return result.data;
};
```

## Best Practices

1. **Start with depth=1** and increase only when needed
2. **Be specific** with populate fields rather than using depth alone
3. **Monitor response times** with deep nesting
4. **Cache responses** when possible for frequently accessed nested data
5. **Use pagination** with complex nested queries
6. **Consider GraphQL** for very complex nested requirements

## Common Use Cases

- **User Dashboard**: `?populate=role,department,managedProjects&depth=2`
- **Product Catalog**: `?populate=category,supplier,productVariants&depth=2`
- **Inventory Management**: `?populate=warehouse,productVariant&depth=2`
- **Department Overview**: `?populate=manager,users,projects&depth=2`
- **Order Details**: `?populate=orderItems&depth=2`
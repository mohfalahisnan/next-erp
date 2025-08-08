# CRUD Operations API Documentation

This document provides comprehensive documentation for the CRUD (Create, Read, Update, Delete) operations available in the Next.js ERP API.

## Overview

The API supports full CRUD operations for all models defined in your Prisma schema. Each operation maintains compatibility with the existing populate and depth functionality for related data fetching.

## API Endpoints

### Base URL Pattern

```
/api/[model]
/api/[model]/[id]
```

### Supported HTTP Methods

| Method | Endpoint            | Purpose                  | ID Required |
| ------ | ------------------- | ------------------------ | ----------- |
| GET    | `/api/[model]`      | Fetch all records        | No          |
| GET    | `/api/[model]/[id]` | Fetch single record      | Yes         |
| POST   | `/api/[model]`      | Create new record        | No          |
| PUT    | `/api/[model]/[id]` | Full update of record    | Yes         |
| PATCH  | `/api/[model]/[id]` | Partial update of record | Yes         |
| DELETE | `/api/[model]/[id]` | Delete record            | Yes         |

## Operation Details

### 1. CREATE (POST)

**Endpoint:** `POST /api/[model]`

**Purpose:** Create a new record in the specified model.

**Request Body:** JSON object with the data for the new record.

**Response:**

- **Success (201):** Created record with optional populated relations
- **Error (400):** Validation errors or database constraints
- **Error (404):** Invalid model name

**Example:**

```javascript
// Create a new user
POST /api/user
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**With Populate:**

```javascript
POST /api/user?populate=role
```

### 2. READ (GET)

**Endpoint:**

- `GET /api/[model]` - Fetch all records
- `GET /api/[model]/[id]` - Fetch single record

**Purpose:** Retrieve records from the specified model.

**Query Parameters:**

- `populate`: Comma-separated list of relations to include
- `depth`: Maximum depth for nested relations (default: 1)

**Response:**

- **Success (200):** Record(s) with optional populated relations
- **Error (404):** Record not found (for single record) or invalid model

**Examples:**

```javascript
// Get all users
GET /api/user

// Get single user by ID
GET /api/user/123

// Get user with populated relations
GET /api/user/123?populate=role,department&depth=2
```

### 3. UPDATE (PUT)

**Endpoint:** `PUT /api/[model]/[id]`

**Purpose:** Completely replace a record with new data.

**Request Body:** JSON object with the complete updated data.

**Response:**

- **Success (200):** Updated record with optional populated relations
- **Error (400):** ID required, validation errors, or database constraints
- **Error (404):** Record not found or invalid model

**Example:**

```javascript
// Update entire user record
PUT /api/user/123
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "password": "newpassword"
}
```

**With Populate:**

```javascript
PUT /api/user/123?populate=role,department
```

### 4. PARTIAL UPDATE (PATCH)

**Endpoint:** `PATCH /api/[model]/[id]`

**Purpose:** Update specific fields of a record without affecting others.

**Request Body:** JSON object with only the fields to update.

**Response:**

- **Success (200):** Updated record with optional populated relations
- **Error (400):** ID required, validation errors, or database constraints
- **Error (404):** Record not found or invalid model

**Example:**

```javascript
// Update only the name field
PATCH /api/user/123
Content-Type: application/json

{
  "name": "John Updated"
}
```

### 5. DELETE

**Endpoint:** `DELETE /api/[model]/[id]`

**Purpose:** Remove a record from the database.

**Response:**

- **Success (200):** Confirmation message
- **Error (400):** ID required
- **Error (404):** Record not found or invalid model

**Example:**

```javascript
// Delete user
DELETE / api / user / 123;
```

## Response Format

All responses follow a consistent format:

```javascript
{
  "data": {}, // The actual data (null for DELETE)
  "message": "Success message",
  "status": "OK", // Status code name
  "total": 1, // Total count
  "page": 1, // Current page
  "limit": 10 // Items per page
}
```

### Error Response Format

```javascript
{
  "error": {
    "message": "Error description",
    "details": "Detailed error information",
    "code": "ERROR_CODE"
  }
}
```

## Populate and Depth Support

All CRUD operations (except DELETE) support the populate and depth parameters:

### Populate Parameter

- **Format:** `?populate=relation1,relation2,relation3`
- **Purpose:** Include related data in the response
- **Example:** `?populate=role,department,manager`

### Depth Parameter

- **Format:** `?depth=2`
- **Purpose:** Control how deep nested relations are fetched
- **Default:** 1
- **Example:** `?populate=department&depth=2` (includes department and department's relations)

### Combined Usage

```javascript
// Create user with populated role
POST /api/user?populate=role

// Update user and return with department relations (depth 2)
PUT /api/user/123?populate=department&depth=2

// Patch user and return with all relations
PATCH /api/user/123?populate=role,department,manager
```

## Error Handling

### Common Error Scenarios

1. **Invalid Model Name (404)**

    ```javascript
    GET / api / invalidmodel;
    // Returns: Model not found error
    ```

2. **Missing ID for Update/Delete (400)**

    ```javascript
    PUT / api / user;
    // Returns: ID is required error
    ```

3. **Record Not Found (404)**

    ```javascript
    GET / api / user / nonexistent;
    // Returns: Record not found error
    ```

4. **Validation Errors (400)**

    ```javascript
    POST /api/user
    { "email": "invalid-email" }
    // Returns: Validation error
    ```

5. **Database Constraints (400)**
    ```javascript
    POST /api/user
    { "email": "existing@email.com" }
    // Returns: Unique constraint error
    ```

## Usage Examples

### Complete User Management Flow

```javascript
// 1. Create a new user
const createResponse = await fetch('/api/user', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		name: 'Alice Johnson',
		email: 'alice@example.com',
		password: 'securepass123',
	}),
});
const newUser = await createResponse.json();
const userId = newUser.data.id;

// 2. Fetch the user with relations
const getResponse = await fetch(`/api/user/${userId}?populate=role,department`);
const userWithRelations = await getResponse.json();

// 3. Update user's name
const patchResponse = await fetch(`/api/user/${userId}`, {
	method: 'PATCH',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ name: 'Alice Smith' }),
});

// 4. Full update of user
const putResponse = await fetch(`/api/user/${userId}`, {
	method: 'PUT',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		name: 'Alice Smith-Johnson',
		email: 'alice.smith@example.com',
		password: 'newpassword123',
	}),
});

// 5. Delete the user
const deleteResponse = await fetch(`/api/user/${userId}`, {
	method: 'DELETE',
});
```

### Department Management

```javascript
// Create department
const dept = await fetch('/api/department', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		name: 'Engineering',
		description: 'Software development team',
	}),
});

// Update department with manager relation
const updatedDept = await fetch(`/api/department/${deptId}?populate=manager`, {
	method: 'PATCH',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ managerId: 'manager-id-123' }),
});
```

## Performance Considerations

1. **Use PATCH over PUT** when updating only specific fields
2. **Limit populate parameters** to only needed relations
3. **Control depth** to avoid over-fetching nested data
4. **Batch operations** when possible (future enhancement)

## Security Best Practices

1. **Validate input data** before sending to API
2. **Handle errors gracefully** in your frontend
3. **Use HTTPS** in production
4. **Implement authentication** and authorization (future enhancement)
5. **Sanitize user input** to prevent injection attacks

## Testing

Run the comprehensive CRUD test suite:

```bash
# Test all CRUD operations
npm run test:crud

# Test specific operations
npm run test:api-id      # GET by ID tests
npm run test:populate-id # GET with populate tests
```

## Future Enhancements

1. **Batch Operations:** Support for creating/updating multiple records
2. **Query Filters:** Advanced filtering and sorting options
3. **Pagination:** Built-in pagination for large datasets
4. **Authentication:** JWT-based authentication system
5. **Rate Limiting:** API rate limiting and throttling
6. **Caching:** Response caching for improved performance
7. **Webhooks:** Event-driven notifications for CRUD operations

## Troubleshooting

### Common Issues

1. **"Model not found" error**
    - Verify the model name matches your Prisma schema
    - Check that the model is properly exported in your database configuration

2. **"ID is required" error**
    - Ensure you're including the ID in the URL for PUT, PATCH, and DELETE operations
    - Verify the ID format matches your database ID type

3. **Validation errors**
    - Check that required fields are included in your request body
    - Verify data types match your Prisma schema definitions

4. **Populate not working**
    - Ensure relation names match your Prisma schema
    - Check that the relations are properly defined in `modelRelations`

5. **Server errors (500)**
    - Check server logs for detailed error information
    - Verify database connection and schema migrations

For additional support, refer to the test files and examples in the project repository.

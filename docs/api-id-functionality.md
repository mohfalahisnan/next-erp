# API ID-Based Functionality Documentation

This document explains the ID-based functionality added to the Next.js ERP API, allowing you to fetch individual records by their unique identifier. This is part of the comprehensive CRUD operations system.

## Overview

The API now supports full CRUD operations (Create, Read, Update, Delete) with ID-based functionality for single record operations. This enhancement maintains full compatibility with existing populate and depth parameters while providing complete data management capabilities.

> **Note:** For complete CRUD operations documentation, see [CRUD Operations Guide](./crud-operations.md).

The API supports two types of read requests:
1. **Get All Records**: Fetch multiple records from a model
2. **Get Single Record by ID**: Fetch a specific record using its unique identifier

## Endpoint Patterns

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

## Features

### ✅ Full Populate Support
- All existing populate functionality works with ID-based requests
- Supports specific field population: `?populate=role,department`
- Supports depth control: `?depth=2`
- Supports combined usage: `?populate=role&depth=3`

### ✅ Error Handling
- **404 Not Found**: When record with specified ID doesn't exist
- **400 Bad Request**: When ID format is invalid or database error occurs
- **404 Not Found**: When model name is invalid

### ✅ Response Format
- **All Records**: Returns array in `data` field
- **Single Record**: Returns object in `data` field
- Consistent metadata structure for both types

## Usage Examples

### Basic ID Fetch
```bash
# Get specific user
curl "http://localhost:3000/api/user/user123"
```

**Response:**
```json
{
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@company.com"
  },
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "message": "Success"
  }
}
```

### ID Fetch with Population
```bash
# Get user with role and department
curl "http://localhost:3000/api/user/user123?populate=role,department"
```

**Response:**
```json
{
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@company.com",
    "role": {
      "id": "role456",
      "name": "Manager",
      "description": "Department Manager"
    },
    "department": {
      "id": "dept789",
      "name": "Engineering",
      "description": "Software Engineering Department"
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

### ID Fetch with Depth
```bash
# Get user with nested relations (depth=2)
curl "http://localhost:3000/api/user/user123?populate=role&depth=2"
```

### Error Examples

#### Record Not Found
```bash
curl "http://localhost:3000/api/user/nonexistent"
```

**Response:**
```json
{
  "error": {
    "message": "Record not found",
    "details": "Record Not Found",
    "code": "NOT_FOUND"
  }
}
```

#### Invalid Model
```bash
curl "http://localhost:3000/api/invalidmodel/123"
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

## Performance Benefits

### Reduced Data Transfer
- Fetching single records significantly reduces response size
- Only returns the specific record you need
- Faster response times for targeted queries

### Optimized Database Queries
- Uses `findUnique` instead of `findMany` for better performance
- Leverages database indexes on ID fields
- Reduced memory usage on server

## Implementation Details

### Route Structure
The API route extracts the ID from the URL path:
```typescript
const {model} = await params;
const entityName = model[0];  // Model name
const id = model[1];          // Record ID (optional)
```

### Query Logic
```typescript
if (id) {
  // Find single record by ID
  data = await entity.findUnique({
    where: { id },
    ...(Object.keys(include).length > 0 && { include })
  });
} else {
  // Find all records
  data = await entity.findMany({
    ...(Object.keys(include).length > 0 && { include })
  });
}
```

### Error Handling
- Validates record existence after database query
- Catches and handles database errors (invalid ID format, etc.)
- Returns appropriate HTTP status codes

## Testing

### Available Test Scripts
```bash
# Basic ID functionality test
npm run test:api-id

# Comprehensive ID + populate test
npm run test:populate-id

# General populate functionality test
npm run test:populate
```

### Test Coverage
- ✅ Basic ID fetch without populate
- ✅ ID fetch with single populate field
- ✅ ID fetch with multiple populate fields
- ✅ ID fetch with depth control
- ✅ ID fetch with all relations (depth only)
- ✅ Error handling for invalid IDs
- ✅ Error handling for invalid models
- ✅ Performance comparison (all vs single)
- ✅ Cross-model testing (User, Department, etc.)

## Best Practices

### When to Use ID Fetch
- ✅ Displaying single record details
- ✅ Editing specific records
- ✅ Showing related data for one item
- ✅ Performance-critical single-record queries

### When to Use All Records
- ✅ Listing/table views
- ✅ Search and filter operations
- ✅ Bulk operations
- ✅ Dashboard summaries

### Population Strategy
- Use specific `populate` fields for targeted data
- Combine with `depth` for nested relations
- Consider performance impact of deep nesting
- Test response times with realistic data volumes

## Migration from All-Records Approach

### Before (All Records)
```javascript
// Fetch all users and find the one you need
const response = await fetch('/api/user?populate=role');
const users = response.data;
const targetUser = users.find(u => u.id === 'user123');
```

### After (ID-Based)
```javascript
// Fetch specific user directly
const response = await fetch('/api/user/user123?populate=role');
const targetUser = response.data;
```

### Benefits of Migration
- 🚀 **Performance**: Faster queries and smaller responses
- 💾 **Memory**: Reduced memory usage on client and server
- 🔧 **Simplicity**: Cleaner code without client-side filtering
- 📊 **Scalability**: Better performance as data grows

## Future Enhancements

### Planned Features
- [ ] Batch ID requests: `/api/user/id1,id2,id3`
- [ ] Partial field selection: `?fields=name,email`
- [ ] Caching support for frequently accessed records
- [ ] GraphQL-style query syntax

### Considerations
- Maintain backward compatibility
- Monitor performance metrics
- Gather user feedback on API usage patterns
- Consider rate limiting for ID-based requests
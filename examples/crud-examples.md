# CRUD Operations Examples

This document provides practical examples for all CRUD operations available in the Next.js ERP API.

## Quick Reference

| Operation | Method | Endpoint            | Purpose           |
| --------- | ------ | ------------------- | ----------------- |
| Create    | POST   | `/api/[model]`      | Create new record |
| Read All  | GET    | `/api/[model]`      | Get all records   |
| Read One  | GET    | `/api/[model]/[id]` | Get single record |
| Update    | PUT    | `/api/[model]/[id]` | Full update       |
| Patch     | PATCH  | `/api/[model]/[id]` | Partial update    |
| Delete    | DELETE | `/api/[model]/[id]` | Delete record     |

## User Management Examples

### 1. Create a New User

```javascript
// Basic user creation
const response = await fetch('/api/user', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		name: 'John Doe',
		email: 'john.doe@company.com',
		password: 'securePassword123',
	}),
});

const result = await response.json();
console.log('Created user:', result.data);
// Response: { data: { id: '1', name: 'John Doe', email: 'john.doe@company.com', ... }, message: 'Created successfully' }
```

### 2. Create User with Populated Relations

```javascript
// Create user and return with role information
const response = await fetch('/api/user?populate=role', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		name: 'Jane Smith',
		email: 'jane.smith@company.com',
		password: 'securePassword456',
		roleId: 'role-123',
	}),
});

const result = await response.json();
console.log('Created user with role:', result.data);
// Response includes populated role data
```

### 3. Get All Users

```javascript
// Get all users
const response = await fetch('/api/user');
const result = await response.json();
console.log('All users:', result.data);

// Get all users with roles
const responseWithRoles = await fetch('/api/user?populate=role');
const resultWithRoles = await responseWithRoles.json();
console.log('Users with roles:', resultWithRoles.data);
```

### 4. Get Single User by ID

```javascript
// Get user by ID
const userId = '1';
const response = await fetch(`/api/user/${userId}`);
const result = await response.json();
console.log('Single user:', result.data);

// Get user with all relations
const responseWithRelations = await fetch(
	`/api/user/${userId}?populate=role,department,manager`
);
const resultWithRelations = await responseWithRelations.json();
console.log('User with relations:', resultWithRelations.data);
```

### 5. Update User (Full Update)

```javascript
// Complete user update
const userId = '1';
const response = await fetch(`/api/user/${userId}`, {
	method: 'PUT',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		name: 'John Smith',
		email: 'john.smith@company.com',
		password: 'newSecurePassword789',
	}),
});

const result = await response.json();
console.log('Updated user:', result.data);
```

### 6. Patch User (Partial Update)

```javascript
// Update only specific fields
const userId = '1';
const response = await fetch(`/api/user/${userId}`, {
	method: 'PATCH',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		name: 'John Updated Name',
		// Only name will be updated, other fields remain unchanged
	}),
});

const result = await response.json();
console.log('Patched user:', result.data);
```

### 7. Delete User

```javascript
// Delete user
const userId = '1';
const response = await fetch(`/api/user/${userId}`, {
	method: 'DELETE',
});

const result = await response.json();
console.log('Delete result:', result.message);
// Response: { data: null, message: 'Deleted successfully' }
```

## Department Management Examples

### 1. Create Department

```javascript
const response = await fetch('/api/department', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		name: 'Engineering',
		description: 'Software development and engineering team',
	}),
});

const result = await response.json();
const departmentId = result.data.id;
```

### 2. Get Department with Manager

```javascript
const response = await fetch(
	`/api/department/${departmentId}?populate=manager`
);
const result = await response.json();
console.log('Department with manager:', result.data);
```

### 3. Update Department Manager

```javascript
const response = await fetch(`/api/department/${departmentId}`, {
	method: 'PATCH',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		managerId: 'user-123',
	}),
});

const result = await response.json();
console.log('Updated department:', result.data);
```

## Product Management Examples

### 1. Create Product

```javascript
const response = await fetch('/api/product', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		name: 'Laptop Computer',
		description: 'High-performance business laptop',
		price: 1299.99,
		sku: 'LAP-001',
		categoryId: 'cat-electronics',
	}),
});

const result = await response.json();
const productId = result.data.id;
```

### 2. Get Product with Category and Inventory

```javascript
const response = await fetch(
	`/api/product/${productId}?populate=category,inventory&depth=2`
);
const result = await response.json();
console.log('Product with relations:', result.data);
```

### 3. Update Product Price

```javascript
const response = await fetch(`/api/product/${productId}`, {
	method: 'PATCH',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		price: 1199.99,
	}),
});

const result = await response.json();
console.log('Updated product price:', result.data);
```

## Error Handling Examples

### 1. Handle Validation Errors

```javascript
try {
	const response = await fetch('/api/user', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name: 'Test User',
			// Missing required email field
		}),
	});

	const result = await response.json();

	if (!response.ok) {
		console.error('Validation error:', result.error);
		// Handle validation error in UI
	} else {
		console.log('User created:', result.data);
	}
} catch (error) {
	console.error('Network error:', error);
}
```

### 2. Handle Not Found Errors

```javascript
try {
	const response = await fetch('/api/user/nonexistent-id');
	const result = await response.json();

	if (response.status === 404) {
		console.log('User not found');
		// Show "User not found" message in UI
	} else {
		console.log('User found:', result.data);
	}
} catch (error) {
	console.error('Error fetching user:', error);
}
```

### 3. Handle Update Conflicts

```javascript
try {
	const response = await fetch('/api/user/123', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email: 'existing@email.com', // Email already exists
		}),
	});

	const result = await response.json();

	if (response.status === 400) {
		console.error('Constraint error:', result.error.message);
		// Show appropriate error message
	}
} catch (error) {
	console.error('Update error:', error);
}
```

## Advanced Usage Patterns

### 1. Batch Operations (Sequential)

```javascript
// Create multiple users sequentially
const users = [
	{ name: 'User 1', email: 'user1@company.com', password: 'pass1' },
	{ name: 'User 2', email: 'user2@company.com', password: 'pass2' },
	{ name: 'User 3', email: 'user3@company.com', password: 'pass3' },
];

const createdUsers = [];
for (const userData of users) {
	const response = await fetch('/api/user', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(userData),
	});

	const result = await response.json();
	if (response.ok) {
		createdUsers.push(result.data);
	}
}

console.log('Created users:', createdUsers);
```

### 2. Complex Relations with Deep Population

```javascript
// Get user with deeply nested relations
const response = await fetch(
	'/api/user/123?populate=role,department,manager&depth=3'
);
const result = await response.json();

// This will include:
// - User's role
// - User's department
// - User's manager
// - Manager's role (depth 2)
// - Manager's department (depth 2)
// - Department's manager (depth 2)
// - And potentially more nested relations up to depth 3

console.log('User with deep relations:', result.data);
```

### 3. Conditional Updates

```javascript
// Update user only if certain conditions are met
async function updateUserConditionally(userId, updates) {
	// First, get current user data
	const getCurrentUser = await fetch(`/api/user/${userId}`);
	const currentUser = await getCurrentUser.json();

	if (!getCurrentUser.ok) {
		throw new Error('User not found');
	}

	// Check conditions
	if (currentUser.data.status === 'active') {
		// Proceed with update
		const updateResponse = await fetch(`/api/user/${userId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updates),
		});

		return await updateResponse.json();
	} else {
		throw new Error('Cannot update inactive user');
	}
}

// Usage
try {
	const result = await updateUserConditionally('123', { name: 'New Name' });
	console.log('User updated:', result.data);
} catch (error) {
	console.error('Update failed:', error.message);
}
```

## React/Next.js Integration Examples

### 1. Custom Hook for CRUD Operations

```javascript
// hooks/useCrud.js
import { useState, useCallback } from 'react';

export function useCrud(model) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const create = useCallback(
		async (data, populate = '') => {
			setLoading(true);
			setError(null);

			try {
				const url = `/api/${model}${populate ? `?populate=${populate}` : ''}`;
				const response = await fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				});

				const result = await response.json();

				if (!response.ok) {
					throw new Error(result.error?.message || 'Create failed');
				}

				return result.data;
			} catch (err) {
				setError(err.message);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[model]
	);

	const update = useCallback(
		async (id, data, populate = '') => {
			setLoading(true);
			setError(null);

			try {
				const url = `/api/${model}/${id}${populate ? `?populate=${populate}` : ''}`;
				const response = await fetch(url, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				});

				const result = await response.json();

				if (!response.ok) {
					throw new Error(result.error?.message || 'Update failed');
				}

				return result.data;
			} catch (err) {
				setError(err.message);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[model]
	);

	const remove = useCallback(
		async (id) => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch(`/api/${model}/${id}`, {
					method: 'DELETE',
				});

				const result = await response.json();

				if (!response.ok) {
					throw new Error(result.error?.message || 'Delete failed');
				}

				return true;
			} catch (err) {
				setError(err.message);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[model]
	);

	return {
		create,
		update,
		remove,
		loading,
		error,
	};
}
```

### 2. Using the Custom Hook

```javascript
// components/UserForm.jsx
import { useState } from 'react';
import { useCrud } from '../hooks/useCrud';

export function UserForm({ user, onSave }) {
	const [formData, setFormData] = useState(
		user || {
			name: '',
			email: '',
			password: '',
		}
	);

	const { create, update, loading, error } = useCrud('user');

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			let result;
			if (user?.id) {
				// Update existing user
				result = await update(user.id, formData, 'role,department');
			} else {
				// Create new user
				result = await create(formData, 'role,department');
			}

			onSave(result);
		} catch (err) {
			console.error('Save failed:', err);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type='text'
				placeholder='Name'
				value={formData.name}
				onChange={(e) =>
					setFormData({ ...formData, name: e.target.value })
				}
				required
			/>

			<input
				type='email'
				placeholder='Email'
				value={formData.email}
				onChange={(e) =>
					setFormData({ ...formData, email: e.target.value })
				}
				required
			/>

			{!user?.id && (
				<input
					type='password'
					placeholder='Password'
					value={formData.password}
					onChange={(e) =>
						setFormData({ ...formData, password: e.target.value })
					}
					required
				/>
			)}

			<button type='submit' disabled={loading}>
				{loading ? 'Saving...' : user?.id ? 'Update' : 'Create'}
			</button>

			{error && <div className='error'>{error}</div>}
		</form>
	);
}
```

These examples demonstrate the full range of CRUD operations available in the API, from basic operations to advanced patterns and React integration. Use these as a starting point for building your own applications with the ERP API.

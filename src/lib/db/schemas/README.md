# Database Schema Structure

This directory contains the separated database schema files for better maintainability and organization.

## File Structure

```
schemas/
├── README.md           # This documentation
├── index.ts           # Main export file
├── base.ts            # Base fields shared across all tables
├── enums.ts           # PostgreSQL enums
├── departments.ts     # Departments table schema
├── roles.ts           # Roles table schema
├── users.ts           # Users table schema
├── projects.ts        # Projects table schema
└── relations.ts       # Table relationships
```

## Benefits of Separation

1. **Maintainability**: Each entity has its own file, making it easier to locate and modify specific schemas
2. **Modularity**: Changes to one entity don't affect others
3. **Readability**: Smaller files are easier to read and understand
4. **Team Collaboration**: Multiple developers can work on different entities without conflicts
5. **Reusability**: Base fields and enums can be easily reused across different schemas

## Usage

All schemas are re-exported through the main `schema.ts` file, so existing imports continue to work:

```typescript
// This still works as before
import { users, departments, projects, roles } from "@/lib/db/schema";

// Or import specific items from individual files
import { users } from "@/lib/db/schemas/users";
import { statusEnum } from "@/lib/db/schemas/enums";
```

## Adding New Schemas

1. Create a new file in the `schemas/` directory
2. Define your table schema using the `baseFields` from `base.ts`
3. Export the table and its types
4. Add any relations to `relations.ts`
5. Re-export from `index.ts`

Example:

```typescript
// schemas/new-entity.ts
import { pgTable, text } from "drizzle-orm/pg-core";
import { baseFields } from "./base";

export const newEntity = pgTable("new_entity", {
  ...baseFields,
  name: text("name").notNull(),
});

export type NewEntity = typeof newEntity.$inferSelect;
export type NewNewEntity = typeof newEntity.$inferInsert;
```
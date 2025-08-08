// Test script to demonstrate the populate depth feature
// This script shows how the buildPopulateInclude function works

const {
	buildPopulateInclude,
	parsePopulateParams,
	getModelRelations,
} = require('./src/lib/populate-utils.ts');

console.log('=== Populate Depth Feature Test ===\n');

// Test 1: Basic population with depth 1
console.log('Test 1: User with role (depth=1)');
const test1 = buildPopulateInclude('user', ['role'], 1);
console.log(JSON.stringify(test1, null, 2));
console.log();

// Test 2: Multiple relations with depth 1
console.log('Test 2: User with role and department (depth=1)');
const test2 = buildPopulateInclude('user', ['role', 'department'], 1);
console.log(JSON.stringify(test2, null, 2));
console.log();

// Test 3: Nested population with depth 2
console.log('Test 3: User with role (depth=2)');
const test3 = buildPopulateInclude('user', ['role'], 2);
console.log(JSON.stringify(test3, null, 2));
console.log();

// Test 4: All relations with depth 2
console.log('Test 4: Department with all relations (depth=2)');
const test4 = buildPopulateInclude('department', [], 2);
console.log(JSON.stringify(test4, null, 2));
console.log();

// Test 5: Deep nesting with depth 3
console.log('Test 5: User with role (depth=3)');
const test5 = buildPopulateInclude('user', ['role'], 3);
console.log(JSON.stringify(test5, null, 2));
console.log();

// Test 6: Show available relations for different models
console.log('Test 6: Available relations for different models');
console.log('User relations:', getModelRelations('user'));
console.log('Department relations:', getModelRelations('department'));
console.log('Product relations:', getModelRelations('product'));
console.log();

// Test 7: Parse URL parameters simulation
console.log('Test 7: URL parameter parsing simulation');
const mockSearchParams = new URLSearchParams(
	'populate=role,department&depth=2'
);
const parsed = parsePopulateParams(mockSearchParams);
console.log('Parsed params:', parsed);
console.log();

console.log('=== Test Complete ===');

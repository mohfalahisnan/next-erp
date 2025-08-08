// Test script to verify automated model relations generation
const {
	parseModelRelations,
	generateModelRelationsString,
} = require('./scripts/generate-model-relations.js');
const {
	modelRelations,
	getModelRelations,
	isValidRelation,
} = require('./src/lib/populate-utils.ts');

console.log('=== Automated Model Relations Test ===\n');

// Test 1: Parse relations from schema
console.log('Test 1: Parsing relations from Prisma schema');
try {
	const parsedRelations = parseModelRelations();
	console.log('✅ Successfully parsed relations from schema');
	console.log('📊 Total models found:', Object.keys(parsedRelations).length);
	console.log();
} catch (error) {
	console.error('❌ Failed to parse relations:', error.message);
}

// Test 2: Verify current modelRelations
console.log('Test 2: Current modelRelations in populate-utils.ts');
console.log(
	'📊 Total models in current mapping:',
	Object.keys(modelRelations).length
);
console.log();

// Test 3: Test specific model relations
console.log('Test 3: Testing specific model relations');
const testModels = ['user', 'product', 'warehouse', 'order'];

for (const model of testModels) {
	const relations = getModelRelations(model);
	console.log(`${model}: [${relations.join(', ')}]`);
}
console.log();

// Test 4: Validate relation functions
console.log('Test 4: Testing relation validation functions');
const testCases = [
	{ model: 'user', relation: 'role', expected: true },
	{ model: 'user', relation: 'department', expected: true },
	{ model: 'user', relation: 'invalidField', expected: false },
	{ model: 'product', relation: 'category', expected: true },
	{ model: 'product', relation: 'supplier', expected: true },
	{ model: 'invalidModel', relation: 'anyField', expected: false },
];

for (const testCase of testCases) {
	const result = isValidRelation(testCase.model, testCase.relation);
	const status = result === testCase.expected ? '✅' : '❌';
	console.log(
		`${status} ${testCase.model}.${testCase.relation} -> ${result} (expected: ${testCase.expected})`
	);
}
console.log();

// Test 5: Compare manual vs automated relations
console.log('Test 5: Comparing current relations with fresh parse');
try {
	const freshRelations = parseModelRelations();
	const currentModels = Object.keys(modelRelations);
	const freshModels = Object.keys(freshRelations);

	console.log('📊 Current models:', currentModels.length);
	console.log('📊 Fresh parsed models:', freshModels.length);

	// Check for differences
	const missingInCurrent = freshModels.filter(
		(model) => !currentModels.includes(model)
	);
	const extraInCurrent = currentModels.filter(
		(model) => !freshModels.includes(model)
	);

	if (missingInCurrent.length > 0) {
		console.log('⚠️  Models missing in current:', missingInCurrent);
	}

	if (extraInCurrent.length > 0) {
		console.log('⚠️  Extra models in current:', extraInCurrent);
	}

	if (missingInCurrent.length === 0 && extraInCurrent.length === 0) {
		console.log('✅ Model lists match perfectly');
	}

	// Check relation differences for common models
	const commonModels = currentModels.filter((model) =>
		freshModels.includes(model)
	);
	let relationDifferences = 0;

	for (const model of commonModels) {
		const currentRels = modelRelations[model] || [];
		const freshRels = freshRelations[model] || [];

		const missingRels = freshRels.filter(
			(rel) => !currentRels.includes(rel)
		);
		const extraRels = currentRels.filter((rel) => !freshRels.includes(rel));

		if (missingRels.length > 0 || extraRels.length > 0) {
			relationDifferences++;
			console.log(`⚠️  ${model}:`);
			if (missingRels.length > 0) {
				console.log(`   Missing: [${missingRels.join(', ')}]`);
			}
			if (extraRels.length > 0) {
				console.log(`   Extra: [${extraRels.join(', ')}]`);
			}
		}
	}

	if (relationDifferences === 0) {
		console.log('✅ All relations match perfectly');
	} else {
		console.log(
			`⚠️  Found ${relationDifferences} models with relation differences`
		);
	}
} catch (error) {
	console.error('❌ Failed to compare relations:', error.message);
}

console.log();
console.log('=== Test Complete ===');
console.log('💡 To update relations, run: npm run generate:relations');

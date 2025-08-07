const fs = require('fs');
const path = require('path');

/**
 * Script to automatically generate modelRelations from Prisma schema
 * This replaces the manual modelRelations mapping in populate-utils.ts
 */

// Path to the Prisma schema file
const SCHEMA_PATH = path.join(__dirname, '..', 'prisma', 'schema.prisma');
// Path to the populate-utils.ts file
const POPULATE_UTILS_PATH = path.join(__dirname, '..', 'src', 'lib', 'populate-utils.ts');

/**
 * Parse Prisma schema and extract model relations
 */
function parseModelRelations() {
  const schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const modelRelations = {};
  
  // Split content into lines for processing
  const lines = schemaContent.split('\n');
  let currentModel = null;
  let inModel = false;
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're starting a model definition
    if (line.startsWith('model ')) {
      const modelMatch = line.match(/model\s+(\w+)\s*\{/);
      if (modelMatch) {
        currentModel = modelMatch[1].toLowerCase(); // Convert to lowercase for consistency
        modelRelations[currentModel] = [];
        inModel = true;
        braceCount = 1;
        continue;
      }
    }
    
    if (!inModel || !currentModel) continue;
    
    // Count braces to know when model ends
    braceCount += (line.match(/\{/g) || []).length;
    braceCount -= (line.match(/\}/g) || []).length;
    
    if (braceCount === 0) {
      inModel = false;
      currentModel = null;
      continue;
    }
    
    // Look for relation fields (lines that don't start with // and contain relation types)
    if (!line.startsWith('//') && !line.startsWith('@@') && line.includes('@relation')) {
      // Extract field name from relation line
      const fieldMatch = line.match(/^(\w+)\s+/);
      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        if (!modelRelations[currentModel].includes(fieldName)) {
          modelRelations[currentModel].push(fieldName);
        }
      }
    } else if (!line.startsWith('//') && !line.startsWith('@@') && line.includes('[]')) {
      // Handle array relations (one-to-many)
      const arrayFieldMatch = line.match(/^(\w+)\s+\w+\[\]/);
      if (arrayFieldMatch) {
        const fieldName = arrayFieldMatch[1];
        if (!modelRelations[currentModel].includes(fieldName)) {
          modelRelations[currentModel].push(fieldName);
        }
      }
    } else if (!line.startsWith('//') && !line.startsWith('@@') && !line.includes('@') && !line.includes('=')) {
      // Handle simple relations (field names that reference other models)
      const simpleRelationMatch = line.match(/^(\w+)\s+(\w+)\??\s*$/);
      if (simpleRelationMatch) {
        const fieldName = simpleRelationMatch[1];
        const fieldType = simpleRelationMatch[2];
        
        // Check if the field type is a model (starts with uppercase)
        if (fieldType.charAt(0) === fieldType.charAt(0).toUpperCase() && 
            fieldType !== 'String' && fieldType !== 'Int' && fieldType !== 'Boolean' && 
            fieldType !== 'DateTime' && fieldType !== 'Decimal' && 
            !fieldType.includes('Status') && !fieldType.includes('Type')) {
          if (!modelRelations[currentModel].includes(fieldName)) {
            modelRelations[currentModel].push(fieldName);
          }
        }
      }
    }
  }
  
  return modelRelations;
}

/**
 * Generate the modelRelations object as a string
 */
function generateModelRelationsString(relations) {
  let result = 'export const modelRelations: Record<string, string[]> = {\n';
  
  for (const [model, fields] of Object.entries(relations)) {
    const fieldsString = fields.map(field => `'${field}'`).join(', ');
    result += `  ${model}: [${fieldsString}],\n`;
  }
  
  result += '};';
  return result;
}

/**
 * Update the populate-utils.ts file with new modelRelations
 */
function updatePopulateUtils(newModelRelationsString) {
  const content = fs.readFileSync(POPULATE_UTILS_PATH, 'utf8');
  
  // Find the start and end of the current modelRelations export
  const startPattern = /export const modelRelations: Record<string, string\[\]> = \{/;
  const startMatch = content.match(startPattern);
  
  if (!startMatch) {
    console.error('Could not find modelRelations export in populate-utils.ts');
    return false;
  }
  
  const startIndex = startMatch.index;
  let braceCount = 0;
  let endIndex = startIndex;
  let foundStart = false;
  
  // Find the end of the modelRelations object
  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];
    if (char === '{') {
      braceCount++;
      foundStart = true;
    } else if (char === '}') {
      braceCount--;
      if (foundStart && braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }
  
  // Replace the old modelRelations with the new one
  const newContent = content.substring(0, startIndex) + 
                    newModelRelationsString + 
                    content.substring(endIndex);
  
  fs.writeFileSync(POPULATE_UTILS_PATH, newContent, 'utf8');
  return true;
}

/**
 * Main function to generate and update model relations
 */
function main() {
  console.log('🔄 Generating model relations from Prisma schema...');
  
  try {
    // Parse the schema and extract relations
    const relations = parseModelRelations();
    
    console.log('📋 Extracted relations:');
    for (const [model, fields] of Object.entries(relations)) {
      console.log(`  ${model}: [${fields.join(', ')}]`);
    }
    
    // Generate the new modelRelations string
    const newModelRelationsString = generateModelRelationsString(relations);
    
    // Update the populate-utils.ts file
    const success = updatePopulateUtils(newModelRelationsString);
    
    if (success) {
      console.log('✅ Successfully updated modelRelations in populate-utils.ts');
      console.log('📁 File updated:', POPULATE_UTILS_PATH);
    } else {
      console.error('❌ Failed to update populate-utils.ts');
    }
    
  } catch (error) {
    console.error('❌ Error generating model relations:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  parseModelRelations,
  generateModelRelationsString,
  updatePopulateUtils
};
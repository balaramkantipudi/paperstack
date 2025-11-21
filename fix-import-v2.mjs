// fix-imports-v2.mjs
import fs from 'fs';
import path from 'path';

function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // More comprehensive pattern matching
  let fixedContent = content
    // Fix ../lib/ patterns
    .replace(/from ['"]\.\.\/lib\//g, "from '@/lib/")
    .replace(/from ['"]\.\.\/\.\.\/lib\//g, "from '@/lib/")
    .replace(/from ['"]\.\.\/\.\.\/\.\.\/lib\//g, "from '@/lib/")
    
    // Fix ../types/ patterns  
    .replace(/from ['"]\.\.\/types\//g, "from '@/types/")
    .replace(/from ['"]\.\.\/\.\.\/types\//g, "from '@/types/")
    .replace(/from ['"]\.\.\/\.\.\/\.\.\/types\//g, "from '@/types/")
    
    // Fix ../utils/ patterns
    .replace(/from ['"]\.\.\/utils\//g, "from '@/utils/")
    .replace(/from ['"]\.\.\/\.\.\/utils\//g, "from '@/utils/")
    .replace(/from ['"]\.\.\/\.\.\/\.\.\/utils\//g, "from '@/utils/")
    
    // Fix import statements
    .replace(/import ['"]\.\.\/lib\//g, "import '@/lib/")
    .replace(/import ['"]\.\.\/\.\.\/lib\//g, "import '@/lib/")
    .replace(/import ['"]\.\.\/\.\.\/\.\.\/lib\//g, "import '@/lib/")
    
    // Fix any other relative imports to lib, types, utils
    .replace(/['"]\.\.\/.*?\/lib\//g, "'@/lib/")
    .replace(/['"]\.\.\/.*?\/types\//g, "'@/types/")
    .replace(/['"]\.\.\/.*?\/utils\//g, "'@/utils/");
  
  if (content !== fixedContent) {
    fs.writeFileSync(filePath, fixedContent);
    console.log(`✅ Fixed imports in: ${filePath}`);
    
    // Show what changed
    const contentLines = content.split('\n');
    const fixedLines = fixedContent.split('\n');
    
    contentLines.forEach((line, index) => {
      if (line !== fixedLines[index] && line.includes('from ')) {
        console.log(`   OLD: ${line.trim()}`);
        console.log(`   NEW: ${fixedLines[index].trim()}`);
        console.log('');
      }
    });
  } else {
    console.log(`⚪ No changes needed: ${filePath}`);
  }
}

function fixImportsInDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`❌ Directory doesn't exist: ${dirPath}`);
    return;
  }
  
  console.log(`\n🔍 Checking directory: ${dirPath}`);
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixImportsInDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixImportsInFile(fullPath);
    }
  });
}

console.log('🚀 Starting comprehensive import fix...\n');

// Fix imports in all directories
fixImportsInDirectory('./src/components');
fixImportsInDirectory('./src/lib');
fixImportsInDirectory('./pages/api');

console.log('\n✨ Import fix completed!');
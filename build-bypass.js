// build-bypass.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Save original package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const originalPackageJson = fs.readFileSync(packageJsonPath, 'utf8');
const packageJson = JSON.parse(originalPackageJson);

try {
  // Modify package.json to use a compatible Next.js version
  packageJson.dependencies.next = "13.4.19";
  
  // Write the modified package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log('Building with modified package.json...');
  
  // Run the build command
  execSync('NODE_OPTIONS="--max_old_space_size=4096" ./node_modules/.bin/next build', { 
    stdio: 'inherit',
    env: { 
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_IGNORE_NODE_VERSION: 'true'
    }
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} finally {
  // Restore the original package.json
  fs.writeFileSync(packageJsonPath, originalPackageJson);
  console.log('Restored original package.json');
}

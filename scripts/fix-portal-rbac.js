// scripts/fix-portal-rbac.js
// Fixes withAuth role arrays across all four portals.
// - admin/**  → ['admin']               (admin only)
// - employee/** → ['employee', 'admin']  (admin can also view)
// - client/**  → ['client', 'admin']     (admin can also view)
// - affiliate/** → ['affiliate', 'admin'] (admin can also view)

const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '..', 'pages');

const PORTAL_RULES = {
  admin: `['admin']`,
  employee: `['employee', 'admin']`,
  client: `['client', 'admin']`,
  affiliate: `['affiliate', 'admin']`,
};

function fixFile(filePath, allowedRolesStr) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Match: export default withAuth(SomeName, ['...', '...']);
  const regex = /export default withAuth\((\w+),\s*\[.*?\]\)/g;
  const newContent = content.replace(regex, (match, componentName) => {
    return `export default withAuth(${componentName}, ${allowedRolesStr})`;
  });

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`⚠️  No withAuth found or already correct: ${filePath}`);
  }
}

function processDir(dirName, allowedRolesStr) {
  const dirPath = path.join(PAGES_DIR, dirName);
  if (!fs.existsSync(dirPath)) {
    console.log(`❌ Directory not found: ${dirPath}`);
    return;
  }
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      // Recurse into subdirs (e.g. admin/offer-letter)
      const subEntries = fs.readdirSync(fullPath, { withFileTypes: true });
      for (const sub of subEntries) {
        if (sub.isFile() && sub.name.endsWith('.tsx')) {
          fixFile(path.join(fullPath, sub.name), allowedRolesStr);
        }
      }
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      fixFile(fullPath, allowedRolesStr);
    }
  }
}

console.log('\n🔧 Fixing Portal RBAC...\n');
for (const [portal, roles] of Object.entries(PORTAL_RULES)) {
  console.log(`\n📁 Processing /${portal}/ → ${roles}`);
  processDir(portal, roles);
}
console.log('\n✅ Done!\n');

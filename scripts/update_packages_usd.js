const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'hp', 'OneDrive', 'Desktop', 'ScalerHouse', 'pages', 'api', 'services', 'packages.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Add priceUSD to DEFAULT_PACKAGES
content = content.replace(/(price:\s*'₹([^']+)',)/g, (match, p1, p2) => {
    const numStr = p2.match(/[\d,]+/);
    if (!numStr) return match;
    const inr = parseInt(numStr[0].replace(/,/g, ''));
    let usd = Math.round(inr / 83);
    
    // Add a plus sign if original had it
    let suffix = p2.includes('+') ? '+' : '';
    let prefix = p2.includes('onwards') ? ' onwards' : '';
    
    return `${p1} priceUSD: '$${usd.toLocaleString('en-US')}${suffix}${prefix}',`;
});

// Update the POST creation in protectedHandler
content = content.replace(
    /price:\s*price \|\| '',\n\s*priceNote:/g, 
    "price: price || '',\n                priceUSD: typeof req.body.priceUSD !== 'undefined' ? req.body.priceUSD : '$0',\n                priceNote:"
);

// Update PATCH route to allow priceUSD
content = content.replace(
    /const { id, \.\.\.updates } = req\.body;/g,
    "const { id, ...updates } = req.body;"
); // Just making sure body destructs properly, no change needed since it spreads ...updates directly onto findByIdAndUpdate.

fs.writeFileSync(filePath, content);
console.log('Update successful');

// scripts/update_blogs.js
// Updates all 13 blog posts in production MongoDB via the API

const batch1 = require('./blog_content_1');
const batch2 = require('./blog_content_2');
const batch3 = require('./blog_content_3');

const allBlogs = [...batch1, ...batch2, ...batch3];

async function run() {
    try {
        console.log('Logging in...');
        const loginRes = await fetch('https://scalerhouse.vercel.app/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@scalerhouse.com', password: 'admin123' })
        });

        if (!loginRes.ok) {
            const err = await loginRes.text();
            console.error('Login failed:', loginRes.status, err);
            return;
        }

        const { token } = await loginRes.json();
        if (!token) throw new Error('No token in response');
        console.log('Logged in. Updating', allBlogs.length, 'blog posts...\n');

        let successCount = 0;
        let failCount = 0;

        for (const blog of allBlogs) {
            const { _id, ...updates } = blog;
            console.log(`Updating: ${blog.title.slice(0, 60)}...`);

            const res = await fetch(`https://scalerhouse.vercel.app/api/blog/${_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            if (res.ok) {
                console.log(`  ✓ Updated [${res.status}]\n`);
                successCount++;
            } else {
                const body = await res.text();
                console.error(`  ✗ Failed [${res.status}]: ${body}\n`);
                failCount++;
            }

            // Small delay between requests
            await new Promise(r => setTimeout(r, 800));
        }

        console.log('==========================================');
        console.log(`Done! ${successCount} updated, ${failCount} failed.`);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

run();

const services = [
    { slug: 'google-my-business', title: 'Google My Business Optimisation', iconEmoji: '📍', description: 'Enhance your local search visibility.' },
    { slug: 'app-development', title: 'App Development', iconEmoji: '📱', description: 'Build scalable cross-platform and native apps.' },
    { slug: 'ui-ux-design', title: 'UI/UX Design', iconEmoji: '🎨', description: 'Craft beautiful, intuitive digital experiences.' },
    { slug: 'graphic-designing', title: 'Graphic Designing', iconEmoji: '🖌️', description: 'High-quality graphics that tell your brand story.' },
    { slug: 'logo-designing', title: 'Logo Designing', iconEmoji: '✨', description: 'Unique, timeless logos for modern brands.' },
    { slug: 'crm-development', title: 'CRM Development', iconEmoji: '⚙️', description: 'Custom CRM systems to manage your leads & sales.' },
    { slug: 'api-automations', title: 'API & Automations', iconEmoji: '⚡', description: 'Automate workflows to save time and scale fast.' }
];

async function run() {
    try {
        console.log('Logging in to get auth token...');
        const loginRes = await fetch('https://scalerhouse.vercel.app/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@scalerhouse.com', password: 'admin123' })
        });

        if (!loginRes.ok) {
            console.error('Login failed:', loginRes.status, await loginRes.text());
            return;
        }

        const data = await loginRes.json();
        const token = data.token;
        if (!token) throw new Error('Failed to get token from response');

        console.log('Got token! Adding services...');

        for (const svc of services) {
            console.log(`\nProcessing ${svc.title}...`);
            const res = await fetch('https://scalerhouse.vercel.app/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(svc)
            });
            console.log(`- Created Service [Status: ${res.status}]`);

            // Wait 1 second before seeding packages just in case
            await new Promise(r => setTimeout(r, 1000));

            // To seed packages, we just need to hit the GET endpoint for that specific service
            // The API internally handles inserting the 3 default packages for that slug
            const pkgRes = await fetch('https://scalerhouse.vercel.app/api/services/packages?serviceSlug=' + svc.slug);
            console.log(`- Seeded Packages [Status: ${pkgRes.status}]`);
        }

        console.log('\nAll done!');
    } catch (e) {
        console.error('Error:', e);
    }
}

run();

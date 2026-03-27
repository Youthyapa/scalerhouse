import * as path from 'path';
import * as fs from 'fs';
import mongoose from 'mongoose';

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const StringVal = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = StringVal;
    }
}

const PermissionSchema = new mongoose.Schema({ path: String, canView: Boolean, canEdit: Boolean, canDelete: Boolean }, { _id: false });
const RoleSchema = new mongoose.Schema({ _id: String, name: String, description: String, isProtected: Boolean, permissions: [PermissionSchema] }, { _id: false });
const EmployeeSchema = new mongoose.Schema({ _id: String, role: String }, { _id: false, strict: false });

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);
    const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);

    const rolesCount = await Role.countDocuments();
    if (rolesCount === 0) {
        const defaultRoles = [
            {
                _id: 'role_admin', name: 'Admin', description: 'Super Administrator', isProtected: true,
                permissions: [{ path: '*', canView: true, canEdit: true, canDelete: true }]
            },
            {
                _id: 'role_sales', name: 'Sales Executive', description: 'Handles leads and client onboarding', isProtected: false,
                permissions: [{ path: '/admin', canView: true, canEdit: false, canDelete: false }, { path: '/admin/leads', canView: true, canEdit: true, canDelete: false }, { path: '/admin/clients', canView: true, canEdit: true, canDelete: false }, { path: '/admin/proposals', canView: true, canEdit: true, canDelete: false }]
            },
            {
                _id: 'role_hr', name: 'HR Manager', description: 'Manages employees and hiring', isProtected: false,
                permissions: [{ path: '/admin', canView: true, canEdit: false, canDelete: false }, { path: '/admin/employees', canView: true, canEdit: true, canDelete: false }, { path: '/admin/careers', canView: true, canEdit: true, canDelete: false }, { path: '/admin/applications', canView: true, canEdit: true, canDelete: false }]
            }
        ];
        await Role.insertMany(defaultRoles);
        console.log('✅ Safely inserted Custom Roles');

        // Migrate admin employee
        await Employee.updateOne({ email: 'admin@scalerhouse.com' }, { $set: { role: 'role_admin' } });
        console.log('✅ Updated Admin employee role ID');
    } else {
        console.log('Roles already exist.');
    }

    await mongoose.disconnect();
}

seed().catch(console.error);

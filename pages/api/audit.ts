// pages/api/audit.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../lib/db';
import mongoose from 'mongoose';
import { checkRateLimit, CONTACT_RATE_LIMIT } from '../../lib/rateLimit';

// Dynamic Schema for Growth Audit Form (since we don't have a pre-existing one)
const auditSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    website: { type: String, required: true },
    whatsapp: { type: String, required: true },
    businessType: { type: String, required: true },
    revenue: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent model overwrite upon hot reloading
const AuditModel = mongoose.models.Audit || mongoose.model('Audit', auditSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Rate limiting to prevent spam
    if (!checkRateLimit(req, res, 'audit', CONTACT_RATE_LIMIT)) return;

    const { name, website, whatsapp, businessType, revenue } = req.body;

    if (!name || !website || !whatsapp || !businessType || !revenue) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await connectDB();
        
        // 1. Save to MongoDB
        await AuditModel.create({ name, website, whatsapp, businessType, revenue });

        // 2. Post to Google Sheets Webhook (if provided)
        const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
        
        if (GOOGLE_SHEETS_WEBHOOK_URL) {
            try {
                // Forward the exact JSON payload to the Google Apps Script Web App
                const sheetResponse = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'Growth Audit Request',
                        name,
                        website,
                        whatsapp,
                        businessType,
                        revenue,
                        date: new Date().toISOString()
                    }),
                });
                
                if (!sheetResponse.ok) {
                    console.error('[audit] Google Sheets API warning: Non-200 response');
                }
            } catch (sheetError) {
                console.error('[audit] Google Sheets API Error:', sheetError);
                // We don't fail the request if just the sheet fails
            }
        }

        return res.status(200).json({ message: 'Audit request received successfully' });
    } catch (err: any) {
        console.error('[audit] error:', err.message);
        return res.status(500).json({ error: 'Internal server error while processing audit request.' });
    }
}

// lib/emailTemplates/onboardingLink.ts
// Email sent to selected candidate with a secure link to submit their documents

export function onboardingLinkEmail({
    name,
    jobTitle,
    onboardingUrl,
    expiresIn = '7 days',
}: {
    name: string;
    jobTitle: string;
    onboardingUrl: string;
    expiresIn?: string;
}): string {
    const firstName = name.split(' ')[0];

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Complete Your Onboarding – ScalerHouse</title>
</head>
<body style="margin:0;padding:0;background-color:#050d1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050d1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#0a1628;border-radius:20px;overflow:hidden;border:1px solid rgba(99,179,237,0.15);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#052e16 0%,#064e3b 50%,#065f46 100%);padding:48px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;margin-bottom:4px;">SCALER<span style="color:#10b981;">HOUSE</span></div>
              <div style="font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:4px;text-transform:uppercase;margin-bottom:28px;">Global Digital Growth Partner</div>
              <div style="font-size:52px;margin-bottom:16px;">📋</div>
              <h1 style="color:#ffffff;font-size:24px;font-weight:900;margin:0 0 8px;">Complete Your Onboarding</h1>
              <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0;">One step closer to officially joining the team!</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 40px 32px;">
              <h2 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 16px;">Hi ${firstName}, we need your documents!</h2>
              <p style="color:#94a3b8;font-size:15px;line-height:1.8;margin:0 0 28px;">
                Congratulations again on being selected for the <strong style="color:#e2e8f0;">${jobTitle}</strong> role at ScalerHouse! 
                Before we can complete your hiring process, we need you to submit a few documents through our secure onboarding portal.
              </p>

              <!-- What you'll need -->
              <div style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);border-radius:14px;padding:24px 28px;margin:0 0 28px;">
                <div style="color:#10b981;font-size:12px;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:16px;">📎 Documents Required</div>
                ${[
            ['🪪', 'Aadhaar Card', 'Front & back or PDF'],
            ['💳', 'PAN Card', 'Clear scan or photo'],
            ['🎓', 'Degree Certificate', 'Highest qualification'],
            ['📄', 'Experience Letter', '(If applicable)'],
            ['📸', 'Passport-size Photo', 'Recent, clear background'],
        ].map(([icon, doc, note]) => `
                <div style="display:flex;align-items:center;margin-bottom:12px;">
                    <span style="font-size:18px;margin-right:12px;">${icon}</span>
                    <span style="color:#e2e8f0;font-size:14px;font-weight:600;">${doc}</span>
                    <span style="color:#64748b;font-size:13px;margin-left:8px;">${note}</span>
                </div>
                `).join('')}
              </div>

              <!-- Also collect -->
              <div style="background:rgba(99,179,237,0.04);border:1px solid rgba(99,179,237,0.1);border-radius:12px;padding:20px 24px;margin:0 0 28px;">
                <div style="color:#63b3ed;font-size:12px;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:12px;">📝 You'll Also Fill In</div>
                <div style="color:#94a3b8;font-size:14px;line-height:2;">
                    • Personal details (address, date of birth)<br/>
                    • Bank account details for payroll<br/>
                    • Emergency contact information<br/>
                    • Digital declaration & agreement
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;margin:32px 0;">
                <a href="${onboardingUrl}" style="display:inline-block;background:linear-gradient(135deg,#059669,#10b981);color:#ffffff;text-decoration:none;padding:18px 48px;border-radius:14px;font-size:16px;font-weight:800;letter-spacing:0.5px;">
                  🚀 Submit My Documents
                </a>
              </div>

              <!-- Security Note -->
              <div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15);border-radius:10px;padding:16px 20px;margin:0 0 24px;">
                <p style="color:#f59e0b;font-size:13px;margin:0;line-height:1.6;">
                  ⚠️ <strong>This link is unique to you and expires in ${expiresIn}.</strong> 
                  Do not share this link with anyone. If you have any issues accessing the form, reply to this email.
                </p>
              </div>

              <div style="border-top:1px solid rgba(99,179,237,0.1);padding-top:20px;margin-top:8px;">
                <p style="color:#64748b;font-size:13px;line-height:1.7;margin:0;">
                  If the button doesn't work, copy and paste this link into your browser:<br/>
                  <a href="${onboardingUrl}" style="color:#10b981;text-decoration:none;word-break:break-all;font-size:12px;">${onboardingUrl}</a>
                </p>
              </div>

              <p style="color:#64748b;font-size:14px;margin:24px 0 0;">Need help? Contact us at <a href="mailto:hr@scalerhouse.com" style="color:#10b981;text-decoration:none;">hr@scalerhouse.com</a></p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#070f1e;padding:24px 40px;text-align:center;border-top:1px solid rgba(99,179,237,0.1);">
              <p style="color:#334155;font-size:12px;margin:0 0 8px;">© 2026 ScalerHouse. All rights reserved.</p>
              <p style="color:#1e3a5f;font-size:11px;margin:0;">Kanpur, Uttar Pradesh, India · <a href="https://scalerhouse.com" style="color:#1e3a5f;text-decoration:none;">scalerhouse.com</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
}

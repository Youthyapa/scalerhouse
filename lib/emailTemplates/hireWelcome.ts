// lib/emailTemplates/hireWelcome.ts
// Premium branded "You're Hired!" email with credentials

export function hireWelcomeEmail({
    name,
    jobTitle,
    userId,
    tempPassword,
    joiningDate,
}: {
    name: string;
    jobTitle: string;
    userId: string;
    tempPassword: string;
    joiningDate?: string;
}): string {
    const firstName = name.split(' ')[0];
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://scalerhouse.vercel.app'}/login`;
    const onboardingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://scalerhouse.vercel.app'}/employee/onboarding`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ScalerHouse – You're Hired!</title>
</head>
<body style="margin:0;padding:0;background-color:#050d1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050d1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#0a1628;border-radius:20px;overflow:hidden;border:1px solid rgba(99,179,237,0.15);">

          <!-- Header: Gold/Premium gradient for hired -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 30%,#0f3460 70%,#533483 100%);padding:52px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;margin-bottom:4px;">SCALER<span style="color:#a855f7;">HOUSE</span></div>
              <div style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:4px;text-transform:uppercase;margin-bottom:32px;">Global Digital Growth Partner</div>
              <div style="font-size:52px;margin-bottom:16px;">🎉</div>
              <h1 style="color:#ffffff;font-size:30px;font-weight:900;margin:0 0 8px;letter-spacing:-0.5px;">You're Officially Hired!</h1>
              <p style="color:rgba(255,255,255,0.6);font-size:15px;margin:0;">Congratulations, ${firstName}. Welcome to the team!</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 40px 32px;">
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 28px;">
                We are thrilled to welcome you to <strong style="color:#e2e8f0;">ScalerHouse</strong>! After a thorough review, we are confident you'll be an outstanding addition to our team as a <strong style="color:#a855f7;">${jobTitle}</strong>.
              </p>

              <!-- Credential Card -->
              <div style="background:linear-gradient(135deg,rgba(88,28,135,0.2),rgba(15,52,96,0.3));border:1px solid rgba(168,85,247,0.3);border-radius:16px;padding:28px 32px;margin:0 0 28px;">
                <div style="color:#a855f7;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:20px;">🔐 Your Login Credentials</div>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:16px;">
                      <div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Employee ID / Username</div>
                      <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(168,85,247,0.25);border-radius:8px;padding:12px 16px;font-family:monospace;font-size:16px;color:#e2e8f0;font-weight:600;letter-spacing:0.5px;">${userId}</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Temporary Password</div>
                      <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(168,85,247,0.25);border-radius:8px;padding:12px 16px;font-family:monospace;font-size:16px;color:#e2e8f0;font-weight:600;letter-spacing:1px;">${tempPassword}</div>
                    </td>
                  </tr>
                </table>
                <p style="color:#f59e0b;font-size:12px;margin:16px 0 0;line-height:1.5;">⚠️ For security, please change your password immediately after your first login.</p>
              </div>

              ${joiningDate ? `
              <!-- Joining Date -->
              <div style="background:rgba(99,179,237,0.06);border:1px solid rgba(99,179,237,0.15);border-radius:12px;padding:18px 24px;margin:0 0 28px;">
                <div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">📅 Joining Date</div>
                <div style="color:#00d4ff;font-size:18px;font-weight:700;">${joiningDate}</div>
              </div>
              ` : ''}

              <!-- Action Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="padding-right:8px;width:50%;">
                    <a href="${loginUrl}" style="display:block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:10px;font-size:14px;font-weight:700;text-align:center;">🚀 Login to Portal</a>
                  </td>
                  <td style="padding-left:8px;width:50%;">
                    <a href="${onboardingUrl}" style="display:block;background:transparent;color:#a855f7;text-decoration:none;padding:13px 20px;border-radius:10px;font-size:14px;font-weight:700;text-align:center;border:1px solid rgba(168,85,247,0.5);">📋 Start Onboarding</a>
                  </td>
                </tr>
              </table>

              <!-- Onboarding Checklist -->
              <h2 style="color:#e2e8f0;font-size:15px;font-weight:700;margin:0 0 14px;text-transform:uppercase;letter-spacing:1px;">Your Onboarding Checklist</h2>
              ${[
            ['✅', 'Login to your Employee Portal using the credentials above'],
            ['📋', 'Complete your digital onboarding form (personal, bank & tax details)'],
            ['📎', 'Upload required documents (Aadhaar, PAN, Degree certificate)'],
            ['🤝', 'Connect with your reporting manager and team'],
            ['🎯', 'Review your first-week goals and responsibilities'],
        ].map(([icon, text]) => `
              <div style="display:flex;align-items:flex-start;margin-bottom:12px;">
                <span style="font-size:16px;margin-right:12px;">${icon}</span>
                <span style="color:#94a3b8;font-size:14px;line-height:1.6;">${text}</span>
              </div>
              `).join('')}

              <div style="margin-top:28px;background:linear-gradient(135deg,rgba(88,28,135,0.1),rgba(15,52,96,0.2));border:1px solid rgba(168,85,247,0.15);border-radius:12px;padding:20px 24px;">
                <p style="color:#94a3b8;font-size:14px;margin:0;line-height:1.7;">
                  🌟 <strong style="color:#e2e8f0;">We believe in building careers, not just filling roles.</strong> At ScalerHouse, you'll have access to continuous learning, mentorship, and real impact on global brands.
                </p>
              </div>

              <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:24px 0 0;">
                For any questions, reach out to your HR at
                <a href="mailto:hr@scalerhouse.com" style="color:#a855f7;text-decoration:none;">hr@scalerhouse.com</a>
              </p>
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

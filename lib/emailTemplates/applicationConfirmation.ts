// lib/emailTemplates/applicationConfirmation.ts
// Premium branded confirmation email for candidates who applied

export function applicationConfirmationEmail({
    name,
    jobTitle,
    department,
}: {
    name: string;
    jobTitle: string;
    department: string;
}): string {
    const firstName = name.split(' ')[0];
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Received – ScalerHouse</title>
</head>
<body style="margin:0;padding:0;background-color:#050d1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050d1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#0a1628;border-radius:20px;overflow:hidden;border:1px solid rgba(99,179,237,0.15);">

          <!-- Header gradient bar -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f3460 0%,#1a5276 40%,#00d4ff 100%);padding:48px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;margin-bottom:4px;">SCALER<span style="color:#00d4ff;">HOUSE</span></div>
              <div style="font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:4px;text-transform:uppercase;">Global Digital Growth Partner</div>
              <div style="margin:28px auto 0;width:72px;height:72px;background:rgba(0,212,255,0.12);border:2px solid rgba(0,212,255,0.4);border-radius:50%;display:flex;align-items:center;justify-content:center;line-height:72px;font-size:30px;">✅</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 40px 32px;">
              <h1 style="color:#ffffff;font-size:26px;font-weight:800;margin:0 0 8px;">Application Received!</h1>
              <p style="color:#63b3ed;font-size:15px;margin:0 0 28px;font-weight:500;">We're excited to hear from you, ${firstName} 🎉</p>

              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Thank you for applying at <strong style="color:#e2e8f0;">ScalerHouse</strong>. We've successfully received your application for the position below.
              </p>

              <!-- Application summary card -->
              <div style="background:rgba(99,179,237,0.06);border:1px solid rgba(99,179,237,0.15);border-radius:14px;padding:24px 28px;margin:0 0 28px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:14px;">
                      <div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">Position Applied For</div>
                      <div style="color:#ffffff;font-size:17px;font-weight:700;">${jobTitle}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="border-top:1px solid rgba(99,179,237,0.1);padding-top:14px;">
                      <div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">Department</div>
                      <div style="color:#00d4ff;font-size:15px;font-weight:600;">${department}</div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- What happens next -->
              <h2 style="color:#e2e8f0;font-size:16px;font-weight:700;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;">What Happens Next</h2>

              <table width="100%" cellpadding="0" cellspacing="0">
                ${[
            ['📋', 'Application Review', 'Our talent team will carefully review your profile and resume within 3–5 business days.'],
            ['📞', 'Initial Screening', 'Shortlisted candidates will be contacted for a brief screening call to understand your fit better.'],
            ['🎯', 'Interview Rounds', 'Successful candidates proceed to a technical/functional interview round with the department head.'],
            ['🎉', 'Offer & Onboarding', 'Selected candidates receive an official offer letter followed by a smooth onboarding experience.'],
        ].map(([icon, step, desc], i) => `
                  <tr>
                    <td style="padding-bottom:${i < 3 ? '20px' : '0'};">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align:top;padding-right:14px;">
                            <div style="width:40px;height:40px;background:rgba(0,212,255,0.1);border-radius:10px;text-align:center;line-height:40px;font-size:18px;">${icon}</div>
                          </td>
                          <td style="vertical-align:top;">
                            <div style="color:#e2e8f0;font-size:14px;font-weight:600;margin-bottom:3px;">${step}</div>
                            <div style="color:#64748b;font-size:13px;line-height:1.6;">${desc}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                `).join('')}
              </table>

              <div style="margin:32px 0;background:linear-gradient(135deg,rgba(0,212,255,0.08),rgba(15,52,96,0.4));border:1px solid rgba(0,212,255,0.2);border-radius:12px;padding:20px 24px;">
                <p style="color:#94a3b8;font-size:14px;margin:0;line-height:1.7;">
                  💡 <strong style="color:#e2e8f0;">Pro Tip:</strong> While you wait, follow us on LinkedIn to stay updated with ScalerHouse news and industry insights. We love candidates who are curious!
                </p>
              </div>

              <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0;">
                If you have any questions about your application, feel free to reach out at
                <a href="mailto:careers@scalerhouse.com" style="color:#00d4ff;text-decoration:none;">careers@scalerhouse.com</a>
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

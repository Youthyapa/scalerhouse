// lib/emailTemplates/offerLetter.ts
// Branded Offer Letter email template

export function offerLetterEmail({
  candidateName,
  jobTitle,
  department,
  joiningDate,
  fixedCTC,
  variableCTC,
  probation,
  reportingManager,
  workingHours,
  location,
}: {
  candidateName: string;
  jobTitle: string;
  department: string;
  joiningDate: string;
  fixedCTC: string;
  variableCTC: string;
  probation: string;
  reportingManager: string;
  workingHours: string;
  location: string;
}): string {
  const firstName = candidateName.split(' ')[0];
  const totalCTC = ((parseFloat(fixedCTC) || 0) + (parseFloat(variableCTC) || 0)).toFixed(2);
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Offer Letter – ScalerHouse</title>
</head>
<body style="margin:0;padding:0;background-color:#050d1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050d1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background-color:#0a1628;border-radius:20px;overflow:hidden;border:1px solid rgba(99,179,237,0.15);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f1f3d 0%,#1a3a5c 50%,#0d2137 100%);padding:52px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;margin-bottom:4px;">SCALER<span style="color:#00d4ff;">HOUSE</span></div>
              <div style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:4px;text-transform:uppercase;margin-bottom:32px;">Global Digital Growth Partner</div>
              <div style="font-size:48px;margin-bottom:16px;">💼</div>
              <h1 style="color:#ffffff;font-size:28px;font-weight:900;margin:0 0 8px;letter-spacing:-0.5px;">Letter of Offer</h1>
              <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0;">Date: ${today}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 40px 32px;">

              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Dear <strong style="color:#e2e8f0;">${candidateName}</strong>,
              </p>
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 24px;">
                We are pleased to extend this offer of employment to you at <strong style="color:#00d4ff;">ScalerHouse</strong>. After careful consideration, we are confident you will be a valuable asset to our team.
              </p>

              <!-- Offer Details Box -->
              <div style="background:linear-gradient(135deg,rgba(0,212,255,0.05),rgba(15,52,96,0.2));border:1px solid rgba(0,212,255,0.2);border-radius:16px;padding:28px 32px;margin:0 0 28px;">
                <div style="color:#00d4ff;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:20px;">📋 Offer Details</div>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${[
                    ['Position / Job Title', jobTitle],
                    ['Department', department],
                    ['Date of Joining', joiningDate],
                    ['Reporting Manager', reportingManager],
                    ['Work Location', location],
                    ['Working Hours', workingHours],
                    ['Probation Period', probation],
                  ].map(([label, value]) => `
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                      <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${label}</span><br/>
                      <span style="color:#e2e8f0;font-size:14px;font-weight:600;">${value || '—'}</span>
                    </td>
                  </tr>`).join('')}
                </table>
              </div>

              <!-- CTC Box -->
              <div style="background:linear-gradient(135deg,rgba(88,28,135,0.15),rgba(15,52,96,0.2));border:1px solid rgba(168,85,247,0.25);border-radius:16px;padding:28px 32px;margin:0 0 28px;">
                <div style="color:#a855f7;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:20px;">💰 Compensation Package</div>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                      <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Fixed CTC (Annual)</span><br/>
                      <span style="color:#e2e8f0;font-size:15px;font-weight:700;">₹${fixedCTC} LPA</span>
                    </td>
                  </tr>
                  ${variableCTC ? `<tr>
                    <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                      <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Variable / Performance Pay</span><br/>
                      <span style="color:#e2e8f0;font-size:15px;font-weight:700;">₹${variableCTC} LPA</span>
                    </td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding:12px 0 0;">
                      <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Total CTC (Annual)</span><br/>
                      <span style="color:#a855f7;font-size:20px;font-weight:900;">₹${totalCTC} LPA</span>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 16px;">
                This offer is contingent upon successful completion of background verification and submission of all required documents. Please confirm your acceptance within <strong style="color:#e2e8f0;">7 working days</strong> by replying to this email.
              </p>

              <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 28px;">
                We are excited to have you on board and look forward to working together to achieve great things.
              </p>

              <p style="color:#94a3b8;font-size:14px;margin:0 0 4px;">Warm regards,</p>
              <p style="color:#e2e8f0;font-size:14px;font-weight:700;margin:0 0 2px;">Shashank Singh</p>
              <p style="color:#64748b;font-size:13px;margin:0 0 2px;">Founder & CEO – ScalerHouse</p>
              <p style="color:#64748b;font-size:13px;margin:0;">
                <a href="mailto:hr@scalerhouse.com" style="color:#00d4ff;text-decoration:none;">hr@scalerhouse.com</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#070f1e;padding:24px 40px;text-align:center;border-top:1px solid rgba(99,179,237,0.1);">
              <p style="color:#334155;font-size:12px;margin:0 0 6px;">© 2026 ScalerHouse. All rights reserved.</p>
              <p style="color:#1e3a5f;font-size:11px;margin:0;">B-25, Neemeshwar MahaMandir Society, Ratan Lal Nagar, Gujaini, Kanpur, UP 208022 · <a href="https://scalerhouse.com" style="color:#1e3a5f;text-decoration:none;">scalerhouse.com</a></p>
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

// lib/emailTemplates/employeeWelcome.ts
// Sent when admin creates a new employee account

export const employeeWelcomeTemplate = (name: string, email: string, tempPassword: string): string => {
    const employeePortalUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://scalerhouse.com'}/login`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ScalerHouse – Employee Portal Access</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; color: #333; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background: #0a1628; padding: 30px 20px; text-align: center; }
        .header h1 { color: #00f0ff; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .header p { color: #64748b; margin: 8px 0 0; font-size: 13px; letter-spacing: 2px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; font-weight: bold; margin-bottom: 16px; color: #0a1628; }
        .box { background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 20px; margin: 20px 0; }
        .cred-row { margin: 8px 0; font-size: 15px; }
        .cred-label { font-weight: bold; color: #64748b; display: inline-block; width: 110px; }
        .cred-val { color: #0f172a; font-family: monospace; font-size: 15px; background: #e2e8f0; padding: 2px 8px; border-radius: 4px; }
        .portal-box { background: #eff6ff; border: 1px solid #93c5fd; border-radius: 6px; padding: 14px 20px; margin: 20px 0; font-size: 14px; color: #1e40af; }
        .btn { display: inline-block; background: #00f0ff; color: #0a1628 !important; text-decoration: none; padding: 14px 36px; border-radius: 6px; font-weight: bold; margin-top: 8px; font-size: 16px; }
        .notice { background: #fef9c3; border: 1px solid #fde047; border-radius: 6px; padding: 12px 16px; font-size: 13px; color: #854d0e; margin-top: 20px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SCALERHOUSE</h1>
            <p>EMPLOYEE PORTAL ACCESS</p>
        </div>
        <div class="content">
            <div class="greeting">Welcome to the Team, ${name}! 🎉</div>
            <p>We're excited to have you on board. Your employee account has been set up on the <strong>ScalerHouse Employee Portal</strong>, where you'll manage your tasks, leads, clients, and tickets.</p>

            <div class="box">
                <p style="margin-top: 0; margin-bottom: 12px; font-weight: bold; color: #166534;">🔑 Your Login Credentials</p>
                <div class="cred-row"><span class="cred-label">Login Email:</span> <span class="cred-val">${email}</span></div>
                <div class="cred-row"><span class="cred-label">Password:</span> <span class="cred-val">${tempPassword}</span></div>
            </div>

            <div class="portal-box">
                📌 <strong>Your portal:</strong> You will be automatically redirected to the <strong>Employee Portal</strong> upon login. Do <em>not</em> try to access the Admin Portal — it is restricted to administrators only.
            </div>

            <div style="text-align: center; margin: 28px 0;">
                <a href="${employeePortalUrl}" class="btn">Login to Employee Portal →</a>
            </div>

            <div class="notice">
                ⚠️ <strong>Security Notice:</strong> Please change your password immediately after your first login. Keep your credentials confidential and do not share them with anyone.
            </div>

            <p style="margin-top: 20px; color: #64748b; font-size: 14px;">
                If you have any issues logging in or accessing your assigned modules, please contact your HR manager or system administrator.
            </p>
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} ScalerHouse. All rights reserved.<br>
            This is an automated message. Please do not reply directly to this email.
        </div>
    </div>
</body>
</html>
    `;
};

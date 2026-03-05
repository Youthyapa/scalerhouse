// lib/emailTemplates/statusUpdate.ts
// Sends status-specific emails when admin updates a candidate's application status

type StatusEmailParams = {
    name: string;
    jobTitle: string;
    status: 'Shortlisted' | 'On Hold' | 'Interview Scheduled' | 'Rejected' | 'Selected';
    interviewDate?: string;
    interviewTime?: string;
    interviewLink?: string;
    adminNotes?: string;
};

const STATUS_META = {
    Shortlisted: {
        icon: '🌟',
        headerGradient: 'linear-gradient(135deg, #0f3460 0%, #1a5276 40%, #00d4ff 100%)',
        accentColor: '#00d4ff',
        headerBg: '#0a1628',
        badge: 'You\'ve Been Shortlisted!',
        tagline: 'Your profile stood out from the crowd.',
        bodyTitle: 'Great News, {firstName}!',
        bodyText: `We've reviewed your application for <strong style="color:#e2e8f0;">{jobTitle}</strong> and we're impressed! Your profile has been shortlisted for the next stage of our selection process.`,
        nextStepTitle: 'What Happens Next',
        nextStepText: 'Our talent team will review your profile further and reach out within 2–3 business days to schedule a screening call. Please keep an eye on your inbox!',
        closingNote: 'Keep your phone and email handy — we\'ll be in touch soon!',
    },
    'Interview Scheduled': {
        icon: '📅',
        headerGradient: 'linear-gradient(135deg, #1a1a2e 0%, #231a40 50%, #3b1f6e 100%)',
        accentColor: '#a855f7',
        headerBg: '#0f0a1e',
        badge: 'Interview Invitation',
        tagline: 'Your next step awaits.',
        bodyTitle: 'You\'re Invited for an Interview!',
        bodyText: `Congratulations, {firstName}! We would like to invite you for an interview for the <strong style="color:#e2e8f0;">{jobTitle}</strong> position at ScalerHouse.`,
        nextStepTitle: 'Interview Details',
        nextStepText: '{interviewDetails}',
        closingNote: 'Please confirm your availability by replying to this email. Wishing you all the best!',
    },
    'On Hold': {
        icon: '⏳',
        headerGradient: 'linear-gradient(135deg, #1c1508 0%, #3d2b0a 50%, #78500e 100%)',
        accentColor: '#f59e0b',
        headerBg: '#130e04',
        badge: 'Application Update',
        tagline: 'Your application is being carefully reviewed.',
        bodyTitle: 'Application Status Update',
        bodyText: `Thank you for your patience, {firstName}. We wanted to update you that your application for <strong style="color:#e2e8f0;">{jobTitle}</strong> is currently on hold while we complete our evaluation process.`,
        nextStepTitle: 'What This Means',
        nextStepText: 'This is not a negative outcome. We are still reviewing all candidates and will update you as soon as a decision is made. We appreciate your patience and continued interest.',
        closingNote: 'You don\'t need to take any action. We\'ll reach out once we have an update.',
    },
    Rejected: {
        icon: '🤝',
        headerGradient: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
        accentColor: '#94a3b8',
        headerBg: '#0d1117',
        badge: 'Application Update',
        tagline: 'Thank you for your interest in ScalerHouse.',
        bodyTitle: 'Thank You, {firstName}',
        bodyText: `We appreciate you taking the time to apply for the <strong style="color:#e2e8f0;">{jobTitle}</strong> role at ScalerHouse. After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.`,
        nextStepTitle: 'What\'s Next',
        nextStepText: 'We will keep your profile in our talent pool for future opportunities that may be a better fit. We encourage you to apply again for future openings that match your skills.',
        closingNote: 'We genuinely wish you all the best in your career journey. Thank you again for your interest in ScalerHouse.',
    },
    Selected: {
        icon: '🎉',
        headerGradient: 'linear-gradient(135deg, #052e16 0%, #064e3b 50%, #065f46 100%)',
        accentColor: '#10b981',
        headerBg: '#021a0e',
        badge: 'You\'re Selected! 🎊',
        tagline: 'Welcome to the ScalerHouse family!',
        bodyTitle: 'Congratulations, {firstName}!',
        bodyText: `We are thrilled to inform you that you have been <strong style="color:#10b981;">selected</strong> for the <strong style="color:#e2e8f0;">{jobTitle}</strong> position at ScalerHouse! You've passed all our evaluation stages and we believe you'll be a fantastic addition to our team.`,
        nextStepTitle: 'Your Next Step — Submit Your Documents',
        nextStepText: 'To proceed with your onboarding, please submit your documents. You will receive a separate email with a secure link to complete your documentation. Please check your inbox (and spam folder) within the next few minutes.',
        closingNote: 'If you have any questions, please reach out to us at <a href="mailto:hr@scalerhouse.com" style="color:#10b981;text-decoration:none;">hr@scalerhouse.com</a>',
    },
};

export function statusUpdateEmail(params: StatusEmailParams): string {
    const { name, jobTitle, status, interviewDate, interviewTime, interviewLink, adminNotes } = params;
    const firstName = name.split(' ')[0];
    const meta = STATUS_META[status];

    const interviewDetails = status === 'Interview Scheduled'
        ? `
        <div style="background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.2);border-radius:12px;padding:20px 24px;margin:16px 0;">
            ${interviewDate ? `<div style="margin-bottom:12px;"><div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">📅 Date</div><div style="color:#e2e8f0;font-size:16px;font-weight:700;">${interviewDate}</div></div>` : ''}
            ${interviewTime ? `<div style="margin-bottom:12px;"><div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">🕐 Time</div><div style="color:#e2e8f0;font-size:16px;font-weight:700;">${interviewTime}</div></div>` : ''}
            ${interviewLink ? `<div><div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">🔗 Meeting Link</div><a href="${interviewLink}" style="color:#a855f7;font-size:14px;word-break:break-all;">${interviewLink}</a></div>` : '<div style="color:#94a3b8;font-size:14px;">Our team will contact you with full interview details shortly.</div>'}
        </div>
        `
        : meta.nextStepText;

    const bodyText = meta.bodyText.replace(/{firstName}/g, firstName).replace(/{jobTitle}/g, jobTitle);
    const bodyTitle = meta.bodyTitle.replace(/{firstName}/g, firstName);
    const nextStepText = meta.nextStepText === '{interviewDetails}' ? interviewDetails : meta.nextStepText;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.badge} – ScalerHouse</title>
</head>
<body style="margin:0;padding:0;background-color:#050d1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050d1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#0a1628;border-radius:20px;overflow:hidden;border:1px solid rgba(99,179,237,0.15);">

          <!-- Header -->
          <tr>
            <td style="background:${meta.headerGradient};padding:48px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;margin-bottom:4px;">SCALER<span style="color:${meta.accentColor};">HOUSE</span></div>
              <div style="font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:4px;text-transform:uppercase;margin-bottom:28px;">Global Digital Growth Partner</div>
              <div style="font-size:52px;margin-bottom:16px;">${meta.icon}</div>
              <h1 style="color:#ffffff;font-size:24px;font-weight:900;margin:0 0 8px;">${meta.badge}</h1>
              <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0;">${meta.tagline}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 40px 32px;">
              <h2 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 16px;">${bodyTitle}</h2>
              <p style="color:#94a3b8;font-size:15px;line-height:1.8;margin:0 0 28px;">${bodyText}</p>

              <!-- Application Info Card -->
              <div style="background:rgba(99,179,237,0.06);border:1px solid rgba(99,179,237,0.12);border-radius:12px;padding:18px 24px;margin:0 0 28px;">
                <div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">Position</div>
                <div style="color:#ffffff;font-size:17px;font-weight:700;">${jobTitle}</div>
              </div>

              <!-- Next Steps -->
              <div style="background:rgba(${meta.accentColor === '#00d4ff' ? '0,212,255' : meta.accentColor === '#a855f7' ? '168,85,247' : meta.accentColor === '#f59e0b' ? '245,158,11' : meta.accentColor === '#10b981' ? '16,185,129' : '148,163,184'},0.06);border:1px solid rgba(${meta.accentColor === '#00d4ff' ? '0,212,255' : meta.accentColor === '#a855f7' ? '168,85,247' : meta.accentColor === '#f59e0b' ? '245,158,11' : meta.accentColor === '#10b981' ? '16,185,129' : '148,163,184'},0.15);border-radius:14px;padding:24px 28px;margin:0 0 24px;">
                <div style="color:${meta.accentColor};font-size:12px;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:12px;">${meta.nextStepTitle}</div>
                <div style="color:#94a3b8;font-size:14px;line-height:1.8;">${nextStepText}</div>
              </div>

              ${adminNotes ? `
              <div style="background:rgba(99,179,237,0.04);border-left:3px solid ${meta.accentColor};padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
                <div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">Note from HR</div>
                <div style="color:#94a3b8;font-size:14px;line-height:1.7;">${adminNotes}</div>
              </div>
              ` : ''}

              <p style="color:#64748b;font-size:14px;line-height:1.7;margin:0;">${meta.closingNote}</p>
              <p style="color:#64748b;font-size:14px;margin:16px 0 0;">Questions? <a href="mailto:careers@scalerhouse.com" style="color:${meta.accentColor};text-decoration:none;">careers@scalerhouse.com</a></p>
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

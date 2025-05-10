import resend from '../lib/resend';
import * as EmailTemplates from '../utils/emailTemplates';

export async function sendSignupVerificationEmail(email: string, verificationLink: string) {
  await resend.emails.send({
    from: 'test@resend.dev',
    to: email,
    subject: 'Account Verification',
    html: EmailTemplates.generateSignupVerificationHtml(verificationLink),
  });
}

export async function sendSignupVerificationEmailExpired(email: string, verificationLink: string) {
  await resend.emails.send({
    from: 'test@resend.dev',
    to: email,
    subject: 'Account Verification',
    html: EmailTemplates.generateSignupVerificationExpiredHtml(verificationLink),
  });
}

export async function sendLoginVerificationEmail(
  email: string,
  verificationLink: string,
  ipAddress: string,
  userAgent: string
) {
  await resend.emails.send({
    from: 'test@resend.dev',
    to: email,
    subject: 'New Verification Link',
    html: EmailTemplates.generateLoginVerificationHtml(verificationLink, ipAddress, userAgent),
  });
}

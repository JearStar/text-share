import resend from '../lib/Resend';
import * as EmailTemplates from '../utils/EmailTemplates';

const FROM_EMAIL = 'test@resend.dev';

export async function sendSignupVerificationEmail(email: string, verificationLink: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Account Verification',
    html: EmailTemplates.generateSignupVerificationHtml(verificationLink),
  });
}

export async function sendSignupVerificationEmailExpired(email: string, verificationLink: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
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
    from: FROM_EMAIL,
    to: email,
    subject: 'New Verification Link',
    html: EmailTemplates.generateLoginVerificationHtml(verificationLink, ipAddress, userAgent),
  });
}

export async function sendForgotPasswordEmail(email: string, verificationLink: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Reset Password Request',
    html: EmailTemplates.generateResetPasswordHtml(verificationLink),
  });
}

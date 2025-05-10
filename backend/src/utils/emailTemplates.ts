export function generateSignupVerificationHtml(verificationLink: string) {
  return `
    <p>
      Welcome to <strong>Text Share</strong>!<br/>
      Please verify your email by clicking the link below:
    </p>
    <p>
      <a href="${verificationLink}">Verify Email</a>
    </p>
  `.trim();
}

export function generateSignupVerificationExpiredHtml(verificationLink: string) {
  return `
    <p>
      Your previous verification link has expired. 
      Please use the new one below:
    </p>
    <p>
      <a href="${verificationLink}">Verify Email</a>
    </p>
  `;
}

export function generateLoginVerificationHtml(
  verificationLink: string,
  ipAddress: string,
  userAgent: string
) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p><strong>New login detected to Text Share.</strong></p>
      <p><strong>IP Address:</strong> ${ipAddress}</p>
      <p><strong>User Agent:</strong> ${userAgent}</p>
      <p>
        If this was you, please verify your login by clicking the link below:
      </p>
      <p>
        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
          Verify Login
        </a>
      </p>
      <p>If you did not attempt to log in, you can safely ignore this email.</p>
    </div>
  `;
}

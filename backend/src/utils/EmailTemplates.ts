export function generateSignupVerificationHtml(verificationLink: string) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
      <h2 style="color: #2c3e50;">Email Verification</h2>
      <p>
        Welcome to <strong>Text Share</strong>!<br/>
        Please verify your email by clicking the link below:
      </p>
      <p>
        <a href="${verificationLink}" href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin-top: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
      </p>
    </div>
  `.trim();
}

export function generateSignupVerificationExpiredHtml(verificationLink: string) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
      <h2 style="color: #2c3e50;">Email Verification</h2>
      <p>
        Your previous verification link has expired. 
        Please use the new one below:
      </p>
      <p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin-top: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
      </p>
    </div>
  `;
}

export function generateLoginVerificationHtml(
  verificationLink: string,
  ipAddress: string,
  userAgent: string
) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
      <h2 style="color: #2c3e50;">New login detected to Text Share.</h2>
      <p><strong>IP Address:</strong> ${ipAddress}</p>
      <p><strong>User Agent:</strong> ${userAgent}</p>
      <p>
        If this was you, please verify your login by clicking the link below:
      </p>
      <p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin-top: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Verify Login
        </a>
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #888;">
        If you did not attempt to log in, you can safely ignore this email.
      </p>
    </div>
  `;
}

export function generateResetPasswordHtml(verificationLink: string): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
      <h2 style="color: #2c3e50;">Reset Your Password</h2>
      <p>We received a request to reset your password. Click the button below to proceed:</p>
      <a href="${verificationLink}" 
         style="display: inline-block; padding: 10px 20px; margin-top: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p style="margin-top: 20px; font-size: 12px; color: #888;">
        If you did not request a password reset, please ignore this email.
      </p>
    </div>
  `;
}

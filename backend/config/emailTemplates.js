export const welcomeEmail = (name) => `
  <div style="font-family:sans-serif; color:#333;">
    <h2 style="color:#1a73e8;">Welcome to MarketSphere, ${name}!</h2>
    <p>
      We are thrilled to have you on board. MarketSphere is the fastest growing marketplace where you can buy and sell nationwide.
      Explore products, create your shop, and reach thousands of customers easily!
    </p>
    <p>
      Remember to keep your account secure. Never share your password with anyone.
    </p>
    <p style="margin-top:20px;">Happy Selling,<br/><strong>MarketSphere Team</strong></p>
  </div>
`;

export const forgotEmail = (name, link) => `
  <div style="font-family:sans-serif; color:#333;">
    <h2 style="color:#d93025;">Password Reset Requested</h2>
    <p>Hello ${name},</p>
    <p>
      We received a request to reset your MarketSphere password. Click the button below to reset it. This link is valid for a short time.
    </p>
    <a href="${link}" style="display:inline-block; padding:10px 20px; background:#1a73e8; color:#fff; text-decoration:none; border-radius:5px;">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <p style="margin-top:20px;">Cheers,<br/><strong>MarketSphere Team</strong></p>
  </div>
`;

export const resetSuccessEmail = (name) => `
  <div style="font-family:sans-serif; color:#333;">
    <h2 style="color:#188038;">Your Password Was Successfully Reset!</h2>
    <p>Hello ${name},</p>
    <p>
      Your MarketSphere password has been updated successfully. You can now login with your new password.
    </p>
    <p style="margin-top:20px;">Stay secure,<br/><strong>MarketSphere Team</strong></p>
  </div>
`;
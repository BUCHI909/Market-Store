import pool from "../config/db.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

// ==================== PROFILE SETTINGS ====================

// Get full profile with all settings
export const getFullProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user basic info
    const userRes = await pool.query(
      `SELECT id, name, email, phone, bio, location, website, avatar, 
              profile_picture, role, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRes.rows[0];

    // Get notification settings
    const notifRes = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1",
      [userId]
    );

    // Get appearance settings
    const appearRes = await pool.query(
      "SELECT * FROM appearance WHERE user_id = $1",
      [userId]
    );

    // Get store settings
    const storeRes = await pool.query(
      "SELECT * FROM store_settings WHERE user_id = $1",
      [userId]
    );

    // Create default settings if they don't exist
    if (notifRes.rows.length === 0) {
      await pool.query(
        `INSERT INTO notifications (user_id) VALUES ($1)`,
        [userId]
      );
    }

    if (appearRes.rows.length === 0) {
      await pool.query(
        `INSERT INTO appearance (user_id) VALUES ($1)`,
        [userId]
      );
    }

    res.json({
      user,
      notifications: notifRes.rows[0] || {
        email_notifications: true,
        order_updates: true,
        promotions: false,
        security_alerts: true,
        weekly_reports: true,
        marketing_emails: false
      },
      appearance: appearRes.rows[0] || {
        theme: "light",
        compact_mode: false,
        animations: true,
        font_size: "medium"
      },
      store: storeRes.rows[0] || {
        store_name: "My Store",
        currency: "₦",
        timezone: "Africa/Lagos"
      }
    });

  } catch (err) {
    console.error("Get Full Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile
export const updateProfileSettings = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, phone, bio, location, website } = req.body;

    // Check if email already exists (if email is being changed)
    if (email) {
      const emailCheck = await pool.query(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [email, userId]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           bio = COALESCE($4, bio),
           location = COALESCE($5, location),
           website = COALESCE($6, website)
       WHERE id = $7
       RETURNING id, name, email, phone, bio, location, website, avatar, role`,
      [name, email, phone, bio, location, website, userId]
    );

    res.json({
      message: "Profile updated successfully",
      user: result.rows[0]
    });

  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get old avatar to delete
    const oldRes = await pool.query(
      "SELECT avatar FROM users WHERE id = $1",
      [userId]
    );

    // Delete old avatar file if exists
    if (oldRes.rows[0]?.avatar) {
      const oldPath = path.join("public", oldRes.rows[0].avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    await pool.query(
      "UPDATE users SET avatar = $1 WHERE id = $2",
      [avatarPath, userId]
    );

    res.json({
      message: "Avatar uploaded successfully",
      avatar: avatarPath
    });

  } catch (err) {
    console.error("Upload Avatar Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== PASSWORD SETTINGS ====================

export const updatePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const userRes = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, userRes.rows[0].password);
    if (!valid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, userId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Update Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== STORE SETTINGS ====================

export const getStoreSettings = async (req, res) => {
  try {
    const userId = req.userId;

    let result = await pool.query(
      "SELECT * FROM store_settings WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      // Create default store settings
      result = await pool.query(
        `INSERT INTO store_settings (user_id, store_name, currency, timezone)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, "My Store", "₦", "Africa/Lagos"]
      );
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Get Store Settings Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateStoreSettings = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      storeName,
      storeDescription,
      storeEmail,
      storePhone,
      storeAddress,
      currency,
      timezone,
      taxRate,
      shippingPolicy,
      returnPolicy
    } = req.body;

    const result = await pool.query(
      `INSERT INTO store_settings (
          user_id, store_name, store_description, store_email,
          store_phone, store_address, currency, timezone,
          tax_rate, shipping_policy, return_policy
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (user_id) DO UPDATE SET
          store_name = EXCLUDED.store_name,
          store_description = EXCLUDED.store_description,
          store_email = EXCLUDED.store_email,
          store_phone = EXCLUDED.store_phone,
          store_address = EXCLUDED.store_address,
          currency = EXCLUDED.currency,
          timezone = EXCLUDED.timezone,
          tax_rate = EXCLUDED.tax_rate,
          shipping_policy = EXCLUDED.shipping_policy,
          return_policy = EXCLUDED.return_policy,
          updated_at = NOW()
       RETURNING *`,
      [
        userId, storeName, storeDescription, storeEmail,
        storePhone, storeAddress, currency, timezone,
        taxRate, shippingPolicy, returnPolicy
      ]
    );

    res.json({
      message: "Store settings updated successfully",
      store: result.rows[0]
    });

  } catch (err) {
    console.error("Update Store Settings Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== NOTIFICATION SETTINGS ====================

export const getNotificationSettings = async (req, res) => {
  try {
    const userId = req.userId;

    let result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO notifications (user_id) VALUES ($1) RETURNING *`,
        [userId]
      );
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Get Notification Settings Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      emailNotifications,
      orderUpdates,
      promotions,
      securityAlerts,
      weeklyReports,
      marketingEmails
    } = req.body;

    const result = await pool.query(
      `INSERT INTO notifications (
          user_id, email_notifications, order_updates,
          promotions, security_alerts, weekly_reports, marketing_emails
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id) DO UPDATE SET
          email_notifications = EXCLUDED.email_notifications,
          order_updates = EXCLUDED.order_updates,
          promotions = EXCLUDED.promotions,
          security_alerts = EXCLUDED.security_alerts,
          weekly_reports = EXCLUDED.weekly_reports,
          marketing_emails = EXCLUDED.marketing_emails,
          updated_at = NOW()
       RETURNING *`,
      [
        userId, emailNotifications, orderUpdates,
        promotions, securityAlerts, weeklyReports, marketingEmails
      ]
    );

    res.json({
      message: "Notification settings updated successfully",
      notifications: result.rows[0]
    });

  } catch (err) {
    console.error("Update Notification Settings Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== APPEARANCE SETTINGS ====================

export const getAppearanceSettings = async (req, res) => {
  try {
    const userId = req.userId;

    let result = await pool.query(
      "SELECT * FROM appearance WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO appearance (user_id) VALUES ($1) RETURNING *`,
        [userId]
      );
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Get Appearance Settings Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAppearanceSettings = async (req, res) => {
  try {
    const userId = req.userId;
    const { theme, compactMode, animations, fontSize } = req.body;

    const result = await pool.query(
      `INSERT INTO appearance (
          user_id, theme, compact_mode, animations, font_size
       ) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE SET
          theme = EXCLUDED.theme,
          compact_mode = EXCLUDED.compact_mode,
          animations = EXCLUDED.animations,
          font_size = EXCLUDED.font_size,
          updated_at = NOW()
       RETURNING *`,
      [userId, theme, compactMode, animations, fontSize]
    );

    res.json({
      message: "Appearance settings updated successfully",
      appearance: result.rows[0]
    });

  } catch (err) {
    console.error("Update Appearance Settings Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== DELETE ACCOUNT ====================

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    // Verify password
    const userRes = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, userRes.rows[0].password);
    if (!valid) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Delete user (cascading will delete all related records)
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    res.clearCookie("token");
    res.json({ message: "Account deleted successfully" });

  } catch (err) {
    console.error("Delete Account Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};